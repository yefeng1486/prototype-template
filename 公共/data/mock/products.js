/**
 * ========================================
 * mock-data/products.js — 商品样例数据
 * ========================================
 * 样例数据按数据域拆分，一域一文件：商品数据只在本文件维护。
 * 各文件通过为 window.MOCK_DATA 挂载字段合并到同一命名空间，
 * 页面读取方式不变：MOCK_DATA.products
 *
 * 引入顺序（在 mock-api.js 之前）：
 *   <script src="../公共/data/mock/products.js"></script>
 *   <script src="../公共/scripts/mock-api.js"></script>
 * ========================================
 */
(function (window) {
  'use strict';

  var D = window.MOCK_DATA = window.MOCK_DATA || {};

  D.products = [
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
})(window);
