/**
 * ========================================
 * mock-data/charts.js — 图表样例数据集
 * ========================================
 * 样例数据按数据域拆分，一域一文件：图表数据只在本文件维护。
 * 各文件通过为 window.MOCK_DATA 挂载字段合并到同一命名空间，
 * 页面读取方式不变：MOCK_DATA.charts
 *
 * 引入方式（仅使用图表数据的页面需要引入，如仪表盘、数据看板）：
 *   <script src="../公共/data/mock/charts.js"></script>
 *
 * 说明：只存「数据」（value/name/数值序列），配色等展示样式由页面自行补充
 * ========================================
 */
(function (window) {
  'use strict';

  var D = window.MOCK_DATA = window.MOCK_DATA || {};

  D.charts = {
    /* 周维度公共序列 */
    weekDays: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    weekRevenue: [3200, 4100, 3800, 5200, 4800, 6800, 5900],        // 周营收/销售额
    weekProfit: [960, 1230, 1140, 1560, 1440, 2040, 1770],          // 周利润
    weekOrderCount: [28, 35, 32, 45, 40, 58, 49],                   // 周订单量

    /* 商品分类销量（本月/上月对比，管理端柱状图） */
    categorySales: {
      categories: ['电子产品', '服装鞋包', '食品生鲜', '美妆个护', '家居日用', '运动户外'],
      currentMonth: [1820, 1350, 980, 760, 640, 420],
      lastMonth: [1650, 1200, 1050, 680, 590, 380]
    },

    /* 订单状态分布（环形图） */
    orderStatus: [
      { value: 128, name: '待付款' },
      { value: 256, name: '已付款' },
      { value: 189, name: '已发货' },
      { value: 520, name: '已完成' },
      { value: 47,  name: '已取消' }
    ],

    /* 流量来源（玫瑰图） */
    trafficSources: [
      { value: 4200, name: '搜索引擎' },
      { value: 2800, name: '直接访问' },
      { value: 2100, name: '社交媒体' },
      { value: 1500, name: '广告推广' },
      { value: 900,  name: '外部链接' },
      { value: 500,  name: '其他' }
    ],

    /* 商品分类占比（环形图） */
    categoryShare: [
      { value: 350, name: '智能穿戴' },
      { value: 250, name: '电脑外设' },
      { value: 200, name: '音频设备' },
      { value: 150, name: '其他' }
    ],

    /* 活动转化漏斗 */
    funnel: [
      { value: 12000, name: '浏览活动' },
      { value: 5800,  name: '点击商品' },
      { value: 3200,  name: '加入购物车' },
      { value: 1850,  name: '提交订单' },
      { value: 1420,  name: '支付完成' }
    ],

    /* 用户增长趋势（新增/活跃） */
    userGrowth: {
      newUsers: [120, 145, 132, 168, 155, 198, 182],
      activeUsers: [820, 910, 880, 1050, 980, 1280, 1150]
    }
  };
})(window);
