/**
 * ========================================
 * mock-data/users.js — 用户样例数据
 * ========================================
 * 样例数据按数据域拆分，一域一文件：用户数据只在本文件维护。
 * 各文件通过为 window.MOCK_DATA 挂载字段合并到同一命名空间，
 * 页面读取方式不变：MOCK_DATA.users
 *
 * 引入顺序（在 mock-api.js 之前）：
 *   <script src="../公共/data/mock/users.js"></script>
 *   <script src="../公共/scripts/mock-api.js"></script>
 * ========================================
 */
(function (window) {
  'use strict';

  var D = window.MOCK_DATA = window.MOCK_DATA || {};

  D.users = [
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
})(window);
