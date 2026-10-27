/**
 * ========================================
 * mock-data/activities.js — 活动样例数据
 * ========================================
 * 样例数据按数据域拆分，一域一文件：活动数据只在本文件维护。
 * 各文件通过为 window.MOCK_DATA 挂载字段合并到同一命名空间，
 * 页面读取方式不变：MOCK_DATA.activities
 *
 * 引入方式（仅使用活动数据的页面需要引入，如运营端活动管理）：
 *   <script src="../公共/data/mock/activities.js"></script>
 * ========================================
 */
(function (window) {
  'use strict';

  var D = window.MOCK_DATA = window.MOCK_DATA || {};

  D.activities = [
    { id: 1, name: '盛夏特惠季', desc: '全品类限时折扣，低至5折起', image: 'images/A_vibrant_summer_promotional_s_2026-07-07T01-53-17.png', status: 'ongoing', startDate: '2025-06-20', endDate: '2025-07-15', participants: 15680, conversion: '12.5%' },
    { id: 2, name: '新品首发周', desc: '新品上市，前100名半价抢购', image: 'images/A_modern_new_product_launch_pr_2026-07-07T01-53-50.png', status: 'ongoing', startDate: '2025-06-25', endDate: '2025-07-05', participants: 8920, conversion: '9.8%' },
    { id: 3, name: '会员日专享', desc: 'VIP会员专享额外95折', image: 'images/A_VIP_membership_exclusive_pro_2026-07-07T01-54-20.png', status: 'upcoming', startDate: '2025-07-10', endDate: '2025-07-10', participants: 0, conversion: '-' },
    { id: 4, name: '618 年中大促', desc: '跨店满减，最高减500', image: 'images/A_festive_mid_year_shopping_ca_2026-07-07T01-55-21.png', status: 'ended', startDate: '2025-06-01', endDate: '2025-06-18', participants: 45200, conversion: '15.2%' }
  ];
})(window);
