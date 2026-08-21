/**
 * ========================================
 * 手机端.js — 手机端公共脚本统一入口
 * ========================================
 * 手机端各页面只需引入本文件，内部统一加载公共 common.js。
 * common.js 末尾会自动注入 prd-map.js 和 prd-reader.js（通过 document.write），
 * 实现非侵入式 PRD 阅读器接入，无需页面单独引入。
 *
 * 引入方式（手机端页面 body 末尾）：
 *   <script src="手机端.js"></script>
 *
 * 依赖关系：
 *   手机端.js → 公共/scripts/common.js → prd-map.js + prd-reader.js
 * ========================================
 */
(function () {
  'use strict';

  // 从 DOM 中自身 <script src> 推导路径
  var scripts = document.getElementsByTagName('script');
  var commonBase = '../公共/scripts/';
  for (var i = 0; i < scripts.length; i++) {
    var src = scripts[i].getAttribute('src') || '';
    if (/手机端\.js/.test(src)) {
      // src 形如 '手机端.js' 或 '../手机端/手机端.js'
      // 目标：推导出 '../公共/scripts/common.js' 的路径前缀
      var idx = src.lastIndexOf('/');
      if (idx >= 0) {
        // src 形如 '../手机端/手机端.js' → 前缀 '../'
        var prefix = src.substring(0, idx + 1); // '../手机端/'
        commonBase = prefix + '../公共/scripts/';
      } else {
        // src 形如 '手机端.js'，说明页面在手机端目录下
        commonBase = '../公共/scripts/';
      }
      break;
    }
  }

  // 用 document.write 同步加载 common.js
  // common.js 末尾会自动注入 prd-map.js 和 prd-reader.js
  // file:// 协议下必须用 document.write，createElement 动态注入会被阻止
  document.write('<script src="' + commonBase + 'common.js"><\/script>');
})();
