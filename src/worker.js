/**
 * Cloudflare Workers 书签导航 API
 * 提供前后台数据接口和认证功能
 */

import indexHTML from '../index.html';
import adminHTML from '../admin.html';

// 数据存储键名
const STORAGE_KEYS = {
  BOOKMARKS: 'bookmarks_data',
  ADMIN_PASSWORD: 'admin_password',
  AUTH_TOKENS: 'auth_tokens'
};

// 工具函数
const utils = {
  // 生成唯一ID
  generateId: () => `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  
  // 生成JWT token
  generateToken: () => {
    const token = Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    return token;
  },
  
  // 验证密码
  verifyPassword: async (password, hash) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const computedHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return computedHash === hash;
  },
  
  // 生成密码哈希
  hashPassword: async (password) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  },
  
  // JSON响应
  jsonResponse: (data, status = 200) => {
    return new Response(JSON.stringify(data), {
      status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  },
  
  // HTML响应
  htmlResponse: (html) => {
    return new Response(html, {
      headers: {
        'Content-Type': 'text/html;charset=UTF-8',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  }
};

// 认证中间件
async function authenticate(request, env) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }
  
  const token = authHeader.substring(7);
  const tokensJson = await env.BOOKMARKS.get(STORAGE_KEYS.AUTH_TOKENS);
  
  if (!tokensJson) return false;
  
  const tokens = JSON.parse(tokensJson);
  const tokenData = tokens[token];
  
  if (!tokenData) return false;
  
  // 检查token是否过期
  const expiresAt = new Date(tokenData.expiresAt);
  if (expiresAt < new Date()) {
    delete tokens[token];
    await env.BOOKMARKS.put(STORAGE_KEYS.AUTH_TOKENS, JSON.stringify(tokens));
    return false;
  }
  
  return true;
}

// 路由处理
const router = {
  // 获取所有书签
  'GET /api/bookmarks': async (request, env) => {
    const data = await env.BOOKMARKS.get(STORAGE_KEYS.BOOKMARKS);
    if (!data) {
      return utils.jsonResponse({ categories: [], bookmarks: [] });
    }
    return utils.jsonResponse(JSON.parse(data));
  },
  
  // 创建书签
  'POST /api/bookmarks': async (request, env) => {
    if (!await authenticate(request, env)) {
      return utils.jsonResponse({ error: 'Unauthorized' }, 401);
    }
    
    const bookmark = await request.json();
    const data = await env.BOOKMARKS.get(STORAGE_KEYS.BOOKMARKS);
    const storage = data ? JSON.parse(data) : { categories: [], bookmarks: [] };
    
    bookmark.id = utils.generateId();
    bookmark.createdAt = new Date().toISOString();
    bookmark.updatedAt = new Date().toISOString();
    bookmark.order = storage.bookmarks.length;
    
    storage.bookmarks.push(bookmark);
    await env.BOOKMARKS.put(STORAGE_KEYS.BOOKMARKS, JSON.stringify(storage));
    
    return utils.jsonResponse(bookmark, 201);
  },
  
  // 更新书签
  'PUT /api/bookmarks/:id': async (request, env, params) => {
    if (!await authenticate(request, env)) {
      return utils.jsonResponse({ error: 'Unauthorized' }, 401);
    }
    
    const updates = await request.json();
    const data = await env.BOOKMARKS.get(STORAGE_KEYS.BOOKMARKS);
    const storage = data ? JSON.parse(data) : { categories: [], bookmarks: [] };
    
    const index = storage.bookmarks.findIndex(b => b.id === params.id);
    if (index === -1) {
      return utils.jsonResponse({ error: 'Not found' }, 404);
    }
    
    storage.bookmarks[index] = {
      ...storage.bookmarks[index],
      ...updates,
      id: params.id,
      updatedAt: new Date().toISOString()
    };
    
    await env.BOOKMARKS.put(STORAGE_KEYS.BOOKMARKS, JSON.stringify(storage));
    return utils.jsonResponse(storage.bookmarks[index]);
  },
  
  // 删除书签
  'DELETE /api/bookmarks/:id': async (request, env, params) => {
    if (!await authenticate(request, env)) {
      return utils.jsonResponse({ error: 'Unauthorized' }, 401);
    }
    
    const data = await env.BOOKMARKS.get(STORAGE_KEYS.BOOKMARKS);
    const storage = data ? JSON.parse(data) : { categories: [], bookmarks: [] };
    
    storage.bookmarks = storage.bookmarks.filter(b => b.id !== params.id);
    await env.BOOKMARKS.put(STORAGE_KEYS.BOOKMARKS, JSON.stringify(storage));
    
    return utils.jsonResponse({ success: true });
  },
  
  // 批量导入书签
  'POST /api/bookmarks/import': async (request, env) => {
    if (!await authenticate(request, env)) {
      return utils.jsonResponse({ error: 'Unauthorized' }, 401);
    }
    
    const { html } = await request.json();
    const data = await env.BOOKMARKS.get(STORAGE_KEYS.BOOKMARKS);
    const storage = data ? JSON.parse(data) : { categories: [], bookmarks: [] };
    
    // 解析HTML书签（简化版，实际应该在前端解析）
    const categoryMap = new Map();
    
    // 创建或获取分类
    const getOrCreateCategory = (name) => {
      if (!categoryMap.has(name)) {
        const category = {
          id: utils.generateId(),
          name,
          icon: '📁',
          order: storage.categories.length + categoryMap.size
        };
        categoryMap.set(name, category);
      }
      return categoryMap.get(name);
    };
    
    // 这里简化处理，实际解析逻辑应该更完善
    // 将新分类添加到存储
    categoryMap.forEach(category => {
      if (!storage.categories.find(c => c.name === category.name)) {
        storage.categories.push(category);
      }
    });
    
    await env.BOOKMARKS.put(STORAGE_KEYS.BOOKMARKS, JSON.stringify(storage));
    return utils.jsonResponse({ success: true });
  },
  
  // 创建分类
  'POST /api/categories': async (request, env) => {
    if (!await authenticate(request, env)) {
      return utils.jsonResponse({ error: 'Unauthorized' }, 401);
    }
    
    const category = await request.json();
    const data = await env.BOOKMARKS.get(STORAGE_KEYS.BOOKMARKS);
    const storage = data ? JSON.parse(data) : { categories: [], bookmarks: [] };
    
    category.id = utils.generateId();
    category.order = storage.categories.length;
    
    storage.categories.push(category);
    await env.BOOKMARKS.put(STORAGE_KEYS.BOOKMARKS, JSON.stringify(storage));
    
    return utils.jsonResponse(category, 201);
  },
  
  // 更新分类
  'PUT /api/categories/:id': async (request, env, params) => {
    if (!await authenticate(request, env)) {
      return utils.jsonResponse({ error: 'Unauthorized' }, 401);
    }
    
    const updates = await request.json();
    const data = await env.BOOKMARKS.get(STORAGE_KEYS.BOOKMARKS);
    const storage = data ? JSON.parse(data) : { categories: [], bookmarks: [] };
    
    const index = storage.categories.findIndex(c => c.id === params.id);
    if (index === -1) {
      return utils.jsonResponse({ error: 'Not found' }, 404);
    }
    
    storage.categories[index] = {
      ...storage.categories[index],
      ...updates,
      id: params.id
    };
    
    await env.BOOKMARKS.put(STORAGE_KEYS.BOOKMARKS, JSON.stringify(storage));
    return utils.jsonResponse(storage.categories[index]);
  },
  
  // 删除分类
  'DELETE /api/categories/:id': async (request, env, params) => {
    if (!await authenticate(request, env)) {
      return utils.jsonResponse({ error: 'Unauthorized' }, 401);
    }
    
    const data = await env.BOOKMARKS.get(STORAGE_KEYS.BOOKMARKS);
    const storage = data ? JSON.parse(data) : { categories: [], bookmarks: [] };
    
    // 检查是否有书签使用此分类
    const hasBookmarks = storage.bookmarks.some(b => b.categoryId === params.id);
    if (hasBookmarks) {
      return utils.jsonResponse({ error: '此分类下还有书签，无法删除' }, 400);
    }
    
    storage.categories = storage.categories.filter(c => c.id !== params.id);
    await env.BOOKMARKS.put(STORAGE_KEYS.BOOKMARKS, JSON.stringify(storage));
    
    return utils.jsonResponse({ success: true });
  },
  
  // 登录
  'POST /api/auth/login': async (request, env) => {
    const { password } = await request.json();
    
    // 获取存储的密码哈希
    let passwordHash = await env.BOOKMARKS.get(STORAGE_KEYS.ADMIN_PASSWORD);
    
    // 如果没有设置密码，使用默认密码 "admin"
    if (!passwordHash) {
      passwordHash = await utils.hashPassword('admin');
      await env.BOOKMARKS.put(STORAGE_KEYS.ADMIN_PASSWORD, passwordHash);
    }
    
    // 验证密码
    const isValid = await utils.verifyPassword(password, passwordHash);
    if (!isValid) {
      return utils.jsonResponse({ error: '密码错误' }, 401);
    }
    
    // 生成token
    const token = utils.generateToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24小时
    
    // 保存token
    const tokensJson = await env.BOOKMARKS.get(STORAGE_KEYS.AUTH_TOKENS);
    const tokens = tokensJson ? JSON.parse(tokensJson) : {};
    
    tokens[token] = {
      createdAt: new Date().toISOString(),
      expiresAt: expiresAt.toISOString()
    };
    
    await env.BOOKMARKS.put(STORAGE_KEYS.AUTH_TOKENS, JSON.stringify(tokens));
    
    return utils.jsonResponse({ token });
  },
  
  // 验证token
  'POST /api/auth/verify': async (request, env) => {
    const isValid = await authenticate(request, env);
    if (!isValid) {
      return utils.jsonResponse({ error: 'Invalid token' }, 401);
    }
    return utils.jsonResponse({ valid: true });
  }
};

// 主处理函数
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;
    
    // CORS预检请求
    if (method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      });
    }
    
    // 前台页面
    if (path === '/' || path === '/index.html') {
      return utils.htmlResponse(indexHTML);
    }
    
    // 后台页面
    if (path === '/admin' || path === '/admin.html') {
      return utils.htmlResponse(adminHTML);
    }
    
    // API路由匹配
    for (const [route, handler] of Object.entries(router)) {
      const [routeMethod, routePath] = route.split(' ');
      if (method !== routeMethod) continue;
      
      // 简单的路由参数匹配
      const pathParts = path.split('/');
      const routeParts = routePath.split('/');
      
      if (pathParts.length !== routeParts.length) continue;
      
      const params = {};
      let match = true;
      
      for (let i = 0; i < routeParts.length; i++) {
        if (routeParts[i].startsWith(':')) {
          params[routeParts[i].substring(1)] = pathParts[i];
        } else if (routeParts[i] !== pathParts[i]) {
          match = false;
          break;
        }
      }
      
      if (match) {
        return handler(request, env, params);
      }
    }
    
    // 404
    return utils.jsonResponse({ error: 'Not Found' }, 404);
  }
};