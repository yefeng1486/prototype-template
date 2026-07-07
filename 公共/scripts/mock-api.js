/**
 * mock-api.js — Mock 数据接口
 * 引入方式：<script src="../公共/scripts/mock-api.js"></script>
 *
 * 数据内嵌在 JS 中（兼容 file:// 协议双击打开）
 * 模拟网络延迟、分页、过滤
 *
 * 使用：
 *   MockAPI.getUsers({ page: 1, pageSize: 10 }).then(function(res) { ... });
 *   MockAPI.getProducts({ keyword: '手机' }).then(function(res) { ... });
 */
(function (window) {
  'use strict';

  /* ===== 内嵌 Mock 数据 ===== */
  var usersData = [
    { id: 1, name: '张三', phone: '13800138001', email: 'zhangsan@example.com', role: '管理员', status: 'active', registerDate: '2025-01-15', orders: 23, amount: 4580.50 },
    { id: 2, name: '李四', phone: '13800138002', email: 'lisi@example.com', role: '普通用户', status: 'active', registerDate: '2025-02-20', orders: 8, amount: 1290.00 },
    { id: 3, name: '王五', phone: '13800138003', email: 'wangwu@example.com', role: '普通用户', status: 'disabled', registerDate: '2025-03-10', orders: 15, amount: 3260.80 },
    { id: 4, name: '赵六', phone: '13800138004', email: 'zhaoliu@example.com', role: 'VIP', status: 'active', registerDate: '2024-12-05', orders: 56, amount: 12380.00 },
    { id: 5, name: '孙七', phone: '13800138005', email: 'sunqi@example.com', role: '普通用户', status: 'active', registerDate: '2025-04-18', orders: 3, amount: 459.90 },
    { id: 6, name: '周八', phone: '13800138006', email: 'zhouba@example.com', role: 'VIP', status: 'active', registerDate: '2024-11-22', orders: 42, amount: 8950.00 },
    { id: 7, name: '吴九', phone: '13800138007', email: 'wujiu@example.com', role: '普通用户', status: 'disabled', registerDate: '2025-05-01', orders: 1, amount: 99.00 },
    { id: 8, name: '郑十', phone: '13800138008', email: 'zhengshi@example.com', role: '管理员', status: 'active', registerDate: '2024-10-15', orders: 67, amount: 15600.00 },
    { id: 9, name: '钱多多', phone: '13800138009', email: 'qianduoduo@example.com', role: 'VIP', status: 'active', registerDate: '2025-01-08', orders: 34, amount: 7820.50 },
    { id: 10, name: '李小小', phone: '13800138010', email: 'lixiaoxiao@example.com', role: '普通用户', status: 'active', registerDate: '2025-06-12', orders: 6, amount: 890.00 },
    { id: 11, name: '陈大文', phone: '13800138011', email: 'chendawen@example.com', role: '普通用户', status: 'active', registerDate: '2025-03-25', orders: 12, amount: 2340.00 },
    { id: 12, name: '林小溪', phone: '13800138012', email: 'linxiaoxi@example.com', role: 'VIP', status: 'active', registerDate: '2024-09-30', orders: 89, amount: 24500.00 },
    { id: 13, name: '黄志远', phone: '13800138013', email: 'huangzhiyuan@example.com', role: '普通用户', status: 'disabled', registerDate: '2025-02-14', orders: 4, amount: 560.00 },
    { id: 14, name: '赵雅芝', phone: '13800138014', email: 'zhaoyazhi@example.com', role: 'VIP', status: 'active', registerDate: '2025-04-20', orders: 28, amount: 6780.00 },
    { id: 15, name: '周润发', phone: '13800138015', email: 'zhourunfa@example.com', role: '普通用户', status: 'active', registerDate: '2025-05-28', orders: 9, amount: 1560.00 }
  ];

  var productsData = [
    { id: 1, name: '智能手表 Pro', category: '智能穿戴', price: 1299.00, stock: 156, sales: 892, status: 'on', image: '⌚', description: '心率监测、血氧检测、50米防水' },
    { id: 2, name: '无线降噪耳机', category: '音频设备', price: 899.00, stock: 234, sales: 1567, status: 'on', image: '🎧', description: '主动降噪、30小时续航、蓝牙5.3' },
    { id: 3, name: '机械键盘 RGB', category: '电脑外设', price: 459.00, stock: 89, sales: 445, status: 'on', image: '⌨️', description: '机械轴体、RGB灯效、热插拔' },
    { id: 4, name: '4K 显示器 27寸', category: '电脑外设', price: 1899.00, stock: 45, sales: 234, status: 'on', image: '🖥️', description: '4K超清、HDR400、Type-C 90W' },
    { id: 5, name: '便携充电宝 20000mAh', category: '手机配件', price: 129.00, stock: 567, sales: 2345, status: 'on', image: '🔋', description: '20000mAh、双向快充、航空可带' },
    { id: 6, name: '智能音箱 mini', category: '智能穿戴', price: 199.00, stock: 0, sales: 678, status: 'off', image: '🔊', description: '语音助手、立体声、智能家居控制' },
    { id: 7, name: '游戏鼠标 轻量化', category: '电脑外设', price: 299.00, stock: 123, sales: 567, status: 'on', image: '🖱️', description: '65g轻量、16000DPI、无线2.4G' },
    { id: 8, name: '蓝牙运动手环', category: '智能穿戴', price: 159.00, stock: 345, sales: 1234, status: 'on', image: '⌚', description: '心率监测、50+运动模式、14天续航' },
    { id: 9, name: 'USB-C 扩展坞', category: '手机配件', price: 259.00, stock: 78, sales: 345, status: 'on', image: '🔌', description: '11合1、4K HDMI、千兆网口' },
    { id: 10, name: '电动牙刷 Sonic', category: '家居生活', price: 199.00, stock: 234, sales: 890, status: 'on', image: '🪥', description: '声波清洁、5种模式、90天续航' },
    { id: 11, name: '空气净化器', category: '家居生活', price: 899.00, stock: 56, sales: 123, status: 'on', image: '🌬️', description: 'HEPA滤网、PM2.5显示、静音' },
    { id: 12, name: '电动升降桌', category: '家居生活', price: 1299.00, stock: 34, sales: 89, status: 'off', image: '🪑', description: '双电机、记忆高度、承重100kg' }
  ];

  var ordersData = [
    { id: 'DD20250628001', userName: '张三', productName: '智能手表 Pro', amount: 1299.00, quantity: 1, status: 'pending', date: '2025-06-28 10:23' },
    { id: 'DD20250628002', userName: '李四', productName: '无线降噪耳机', amount: 1798.00, quantity: 2, status: 'paid', date: '2025-06-28 11:45' },
    { id: 'DD20250628003', userName: '王五', productName: '机械键盘 RGB', amount: 459.00, quantity: 1, status: 'shipped', date: '2025-06-28 14:12' },
    { id: 'DD20250627001', userName: '赵六', productName: '4K 显示器 27寸', amount: 1899.00, quantity: 1, status: 'completed', date: '2025-06-27 09:30' },
    { id: 'DD20250627002', userName: '孙七', productName: '便携充电宝 20000mAh', amount: 387.00, quantity: 3, status: 'completed', date: '2025-06-27 15:20' },
    { id: 'DD20250626001', userName: '周八', productName: '游戏鼠标 轻量化', amount: 299.00, quantity: 1, status: 'cancelled', date: '2025-06-26 08:15' },
    { id: 'DD20250626002', userName: '吴九', productName: '蓝牙运动手环', amount: 318.00, quantity: 2, status: 'paid', date: '2025-06-26 16:40' },
    { id: 'DD20250625001', userName: '郑十', productName: 'USB-C 扩展坞', amount: 518.00, quantity: 2, status: 'shipped', date: '2025-06-25 10:00' },
    { id: 'DD20250625002', userName: '钱多多', productName: '电动牙刷 Sonic', amount: 199.00, quantity: 1, status: 'completed', date: '2025-06-25 14:30' },
    { id: 'DD20250624001', userName: '林小溪', productName: '空气净化器', amount: 1798.00, quantity: 2, status: 'pending', date: '2025-06-24 09:45' }
  ];

  /* ===== 工具：模拟延迟 ===== */
  function delay(data, ms) {
    return new Promise(function (resolve) {
      setTimeout(function () { resolve(data); }, ms || 300 + Math.random() * 200);
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
