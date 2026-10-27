/**
 * ========================================
 * mock-data/orders.js — 订单样例数据
 * ========================================
 * 样例数据按数据域拆分，一域一文件：订单数据只在本文件维护。
 * 各文件通过为 window.MOCK_DATA 挂载字段合并到同一命名空间，
 * 页面读取方式不变：MOCK_DATA.orders
 *
 * 引入顺序（在 mock-api.js 之前）：
 *   <script src="../公共/data/mock/orders.js"></script>
 *   <script src="../公共/scripts/mock-api.js"></script>
 * ========================================
 */
(function (window) {
  'use strict';

  var D = window.MOCK_DATA = window.MOCK_DATA || {};

  D.orders = [
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
})(window);
