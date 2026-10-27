/**
 * mock-api.js — Mock 数据接口
 * 引入方式（数据文件在前，本文件在后）：
 *   <script src="../公共/data/mock/users.js"></script>
 *   <script src="../公共/data/mock/products.js"></script>
 *   <script src="../公共/data/mock/orders.js"></script>
 *   <script src="../公共/scripts/mock-api.js"></script>
 *
 * 样例数据按数据域拆分，统一维护在 公共/data/mock/ 目录（一域一文件：
 * users.js / products.js / orders.js / activities.js / charts.js），
 * 各文件为 window.MOCK_DATA 挂载字段，本文件只提供接口：
 * 模拟网络延迟、分页、过滤。样例数据不在本文件内维护。
 *
 * 使用：
 *   MockAPI.getUsers({ page: 1, pageSize: 10 }).then(function(res) { ... });
 *   MockAPI.getProducts({ keyword: '手机' }).then(function(res) { ... });
 */
(function (window) {
  'use strict';

  /* ===== 数据源：公共/data/mock/ 下按数据域拆分的 .js 文件 ===== */
  var db = window.MOCK_DATA || {};
  var usersData = db.users || [];
  var productsData = db.products || [];
  var ordersData = db.orders || [];

  /* ===== 工具：模拟延迟 ===== */
  function delay(data, ms) {
    return new Promise(function (resolve, reject) {
      // data 可能是一个 Promise（如新增/查询接口）。
      // 先预挂空 rejection handler，避免同步 reject 的 promise 在延迟转发前被判定为 unhandled；
      // 延迟后（模拟网络耗时）再将结果转发给调用方。
      if (data && typeof data.then === 'function') {
        data.then(null, function () {});
      }
      setTimeout(function () {
        if (data && typeof data.then === 'function') {
          data.then(resolve, reject);
        } else {
          resolve(data);
        }
      }, ms || 300 + Math.random() * 100);
    });
  }

  /* ===== 工具：分页 ===== */
  function paginate(list, page, pageSize) {
    page = page || 1;
    pageSize = pageSize || 10;
    var start = (page - 1) * pageSize;
    return {
      list: list.slice(start, start + pageSize),
      total: list.length,
      page: page,
      pageSize: pageSize,
      totalPages: Math.ceil(list.length / pageSize)
    };
  }

  /* ===== MockAPI ===== */
  var MockAPI = {
    /* 用户 */
    getUsers: function (params) {
      params = params || {};
      var list = usersData.slice();
      if (params.keyword) {
        var kw = params.keyword.toLowerCase();
        list = list.filter(function (u) {
          return u.name.toLowerCase().includes(kw) || u.phone.includes(kw) || u.email.toLowerCase().includes(kw);
        });
      }
      if (params.status) list = list.filter(function (u) { return u.status === params.status; });
      if (params.role) list = list.filter(function (u) { return u.role === params.role; });
      return delay(paginate(list, params.page, params.pageSize));
    },

    /* 新增用户 */
    addUser: function (user) {
      return delay(new Promise(function (resolve, reject) {
        // 手机号 / 邮箱唯一性校验
        var dup = usersData.some(function (u) {
          return u.phone === user.phone || u.email === user.email;
        });
        if (dup) {
          reject({ code: 409, message: '手机号或邮箱已存在' });
          return;
        }
        var maxId = usersData.reduce(function (m, u) { return Math.max(m, u.id); }, 0);
        // 当前日期 YYYY-MM-DD
        var d = new Date();
        var y = d.getFullYear();
        var mo = ('0' + (d.getMonth() + 1)).slice(-2);
        var day = ('0' + d.getDate()).slice(-2);
        var newUser = {
          id: maxId + 1,
          name: user.name,
          phone: user.phone,
          email: user.email,
          role: user.role || '普通用户',
          status: user.status || 'active',
          registerDate: user.registerDate || (y + '-' + mo + '-' + day),
          orders: 0,
          amount: 0
        };
        usersData.unshift(newUser);
        resolve(newUser);
      }));
    },

    /* 获取单个用户详情 */
    getUserById: function (id) {
      return delay(new Promise(function (resolve, reject) {
        var user = usersData.find(function (u) { return u.id === id; });
        if (!user) {
          reject({ code: 404, message: '用户不存在' });
          return;
        }
        resolve(Object.assign({}, user));
      }));
    },

    /* 商品 */
    getProducts: function (params) {
      params = params || {};
      var list = productsData.slice();
      if (params.keyword) {
        var kw = params.keyword.toLowerCase();
        list = list.filter(function (p) { return p.name.toLowerCase().includes(kw) || p.category.toLowerCase().includes(kw); });
      }
      if (params.category) list = list.filter(function (p) { return p.category === params.category; });
      if (params.status) list = list.filter(function (p) { return p.status === params.status; });
      return delay(paginate(list, params.page, params.pageSize));
    },

    getProductById: function (id) {
      var p = productsData.find(function (item) { return item.id === Number(id); });
      return delay(p || null);
    },

    /* 订单 */
    getOrders: function (params) {
      params = params || {};
      var list = ordersData.slice();
      if (params.status) list = list.filter(function (o) { return o.status === params.status; });
      if (params.keyword) {
        var kw = params.keyword.toLowerCase();
        list = list.filter(function (o) { return o.id.toLowerCase().includes(kw) || o.userName.toLowerCase().includes(kw); });
      }
      return delay(paginate(list, params.page, params.pageSize));
    },

    /* 统计 */
    getStats: function () {
      return delay({
        totalUsers: usersData.length,
        activeUsers: usersData.filter(function (u) { return u.status === 'active'; }).length,
        totalProducts: productsData.length,
        onProducts: productsData.filter(function (p) { return p.status === 'on'; }).length,
        totalOrders: ordersData.length,
        pendingOrders: ordersData.filter(function (o) { return o.status === 'pending'; }).length,
        totalRevenue: ordersData.filter(function (o) { return o.status !== 'cancelled'; }).reduce(function (sum, o) { return sum + o.amount; }, 0),
        totalSales: productsData.reduce(function (sum, p) { return sum + p.sales; }, 0)
      });
    },

    /* 原始数据（供需要全量数据的场景） */
    raw: {
      users: usersData,
      products: productsData,
      orders: ordersData
    }
  };

  window.MockAPI = MockAPI;
})(window);
