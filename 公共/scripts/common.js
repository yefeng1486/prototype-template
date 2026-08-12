/**
 * ========================================
 * common.js — 公共方法库
 * ========================================
 * 所有端的页面均可通过 window.Common 调用
 * 引入方式：<script src="../公共/scripts/common.js"></script>
 *
 * 包含：DOM 操作、格式化、UI 反馈、存储、工具函数、iframe 通信
 * ========================================
 */
(function (window) {
  'use strict';

  var Common = {};

  /* ========== DOM 快捷方法 ========== */

  /** querySelector */
  Common.$ = function (selector, parent) {
    return (parent || document).querySelector(selector);
  };

  /** querySelectorAll → 数组 */
  Common.$$ = function (selector, parent) {
    return Array.prototype.slice.call((parent || document).querySelectorAll(selector));
  };

  /** 创建元素 */
  Common.createEl = function (tag, attrs, children) {
    var el = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (key) {
        if (key === 'class') el.className = attrs[key];
        else if (key === 'text') el.textContent = attrs[key];
        else if (key === 'html') el.innerHTML = attrs[key];
        else if (key === 'style' && typeof attrs[key] === 'object') Object.assign(el.style, attrs[key]);
        else if (key.startsWith('data-')) el.setAttribute(key, attrs[key]);
        else el[key] = attrs[key];
      });
    }
    if (children) {
      (Array.isArray(children) ? children : [children]).forEach(function (child) {
        if (typeof child === 'string') el.appendChild(document.createTextNode(child));
        else if (child) el.appendChild(child);
      });
    }
    return el;
  };

  /* ========== 格式化 ========== */

  /** 格式化金额 → ¥1,234.56 */
  Common.formatMoney = function (num, prefix) {
    if (prefix === undefined) prefix = '¥';
    var n = Number(num) || 0;
    return prefix + n.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  /** 格式化数字 → 1,234 */
  Common.formatNumber = function (num) {
    return (Number(num) || 0).toLocaleString('zh-CN');
  };

  /** 格式化日期 → 2026-01-15 / 2026-01-15 14:30 */
  Common.formatDate = function (date, withTime) {
    if (!date) return '-';
    var d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
    if (isNaN(d.getTime())) return '-';
    var y = d.getFullYear();
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    var str = y + '-' + m + '-' + day;
    if (withTime) {
      var h = String(d.getHours()).padStart(2, '0');
      var min = String(d.getMinutes()).padStart(2, '0');
      str += ' ' + h + ':' + min;
    }
    return str;
  };

  /** 相对时间 → 3小时前 / 2天前 */
  Common.formatRelativeTime = function (date) {
    if (!date) return '-';
    var d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
    var diff = Date.now() - d.getTime();
    var sec = Math.floor(diff / 1000);
    var min = Math.floor(sec / 60);
    var hour = Math.floor(min / 60);
    var day = Math.floor(hour / 24);
    if (sec < 60) return '刚刚';
    if (min < 60) return min + '分钟前';
    if (hour < 24) return hour + '小时前';
    if (day < 30) return day + '天前';
    return Common.formatDate(d);
  };

  /* ========== UI 反馈 ========== */

  // ---- Toast 私有状态 ----
  var _toastContainer = null;

  function _ensureToastContainer() {
    if (!_toastContainer || !document.querySelector('.common-toast-container')) {
      _toastContainer = document.createElement('div');
      _toastContainer.className = 'common-toast-container';
      _toastContainer.style.cssText = 'position:fixed;top:16px;right:16px;z-index:99999;display:flex;flex-direction:column;gap:8px;pointer-events:none;';
      document.body.appendChild(_toastContainer);
    }
    return _toastContainer;
  }

  /** Toast 提示（带图标 + 堆叠 + 自动消失）
   *  @param {string} message 提示内容
   *  @param {string} [type='info'] 类型：info | success | warning | danger（向后兼容）
   *  @param {number} [duration=2500] 显示时长(ms)，0=不自动消失
   *  @returns {HTMLElement}
   */
  Common.toast = function (message, type, duration) {
    if (!message) return;
    type = type || 'info';
    duration = (typeof duration === 'number') ? duration : 2500;

    var icons = {
      info: '\uf05a', success: '\uf058', warning: '\uf071', danger: '\uf057'
    };
    var colors = {
      info:    { bg: 'var(--color-info-bg, #EFF6FF)', text: 'var(--color-info, #3B82F6)', border: '#BFDBFE' },
      success: { bg: 'var(--color-success-bg, #ECFDF5)', text: 'var(--color-success, #10B981)', border: '#A7F3D0' },
      warning: { bg: 'var(--color-warning-bg, #FFFBEB)', text: 'var(--color-warning, #F59E0B)', border: '#FDE68A' },
      danger:  { bg: 'var(--color-danger-bg, #FEF2F2)',  text: 'var(--color-danger, #EF4444)',  border: '#FECACA' }
    };
    var c = colors[type] || colors.info;

    var container = _ensureToastContainer();

    var toast = document.createElement('div');
    toast.style.cssText = [
      'display:flex; align-items:center; gap:8px;',
      'padding:10px 16px; border-radius:' + 'var(--radius-lg, 8px);',
      'font-size:' + 'var(--font-size-sm, 13px);',
      'box-shadow:' + 'var(--shadow-lg, 0 10px 15px -3px rgba(0,0,0,0.1));',
      'cursor:pointer; pointer-events:auto;',
      'transform:translateX(120%); opacity:0;',
      'transition:all 0.25s cubic-bezier(0.22, 1, 0.36, 1);',
      'max-width:360px; line-height:1.4;',
      'background:' + c.bg + '; color:' + c.text + '; border:1px solid ' + c.border + ';'
    ].join('');

    var icon = document.createElement('span');
    icon.style.cssText = 'flex-shrink:0; font-size:14px; font-family:"FontAwesome";';
    icon.textContent = icons[type] || icons.info;
    toast.appendChild(icon);

    var text = document.createElement('span');
    text.style.cssText = 'flex:1; word-break:break-word; font-family:inherit;';
    text.textContent = message;
    toast.appendChild(text);

    // 点击关闭
    toast.addEventListener('click', function () { Common.dismissToast(toast); });

    container.appendChild(toast);

    // 动画
    requestAnimationFrame(function () {
      toast.style.transform = 'translateX(0)';
      toast.style.opacity = '1';
    });

    // 自动消失
    if (duration > 0) {
      setTimeout(function () { Common.dismissToast(toast); }, duration);
    }

    return toast;
  };

  /** 手动关闭 Toast */
  Common.dismissToast = function (toast) {
    if (!toast || toast._dismissing) return;
    toast._dismissing = true;
    toast.style.transform = 'translateX(120%)';
    toast.style.opacity = '0';
    setTimeout(function () {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
      // 清理空容器
      var c = document.querySelector('.common-toast-container');
      if (c && c.children.length === 0 && c.parentNode) { c.parentNode.removeChild(c); _toastContainer = null; }
    }, 250);
  };

  // ---- Confirm 私有状态 ----
  var _confirmOverlay = null;
  var _confirmResolve = null;

  function _closeConfirm(result) {
    if (!_confirmOverlay) return;
    var overlay = _confirmOverlay;
    _confirmOverlay = null;
    overlay.style.opacity = '0';
    setTimeout(function () { if (overlay.parentNode) overlay.parentNode.removeChild(overlay); }, 200);
    if (_confirmResolve) { _confirmResolve(result); _confirmResolve = null; }
  }

  /**
   * 确认对话框（支持两种调用方式）
   *
   * 旧方式（向后兼容）：Common.confirm('确定删除？', onConfirm, onCancel)
   * 新方式（推荐）：Common.confirm({ title, message, type, confirmText, cancelText })
   *
   * @param {string|object} opts - 消息字符串或配置对象
   * @param {string} [opts.title='提示'] 标题
   * @param {string} [opts.message='确定要执行此操作吗？'] 内容
   * @param {string} [opts.type='info'] 类型：danger | warning | info
   * @param {string} [opts.confirmText='确定'] 确认按钮文字
   * @param {string} [opts.cancelText='取消'] 取消按钮文字
   * @param {function} [onConfirm] (旧方式) 确认回调
   * @param {function} [onCancel] (旧方式) 取消回调
   * @returns {Promise<boolean>}
   */
  Common.confirm = function (opts, onConfirm, onCancel) {
    // 向后兼容：字符串参数
    if (typeof opts === 'string') opts = { message: opts };
    opts = opts || {};

    var title = opts.title || '提示';
    var message = opts.message || '确定要执行此操作吗？';
    var confirmText = opts.confirmText || '确定';
    var cancelText = opts.cancelText || '取消';
    var type = opts.type || 'info';

    // 合并旧式回调
    var _onConfirm = opts.onConfirm || onConfirm || null;
    var _onCancel = opts.onCancel || onCancel || null;

    // info 类型图标
    var iconConfig = {
      danger:  { icon: '\uf071', bg: 'var(--color-danger-bg, #FEF2F2)',  color: 'var(--color-danger, #EF4444)' },
      warning: { icon: '\uf06a', bg: 'var(--color-warning-bg, #FFFBEB)', color: 'var(--color-warning, #F59E0B)' },
      info:    { icon: '\uf05a', bg: 'var(--color-info-bg, #EFF6FF)',    color: 'var(--color-info, #3B82F6)' }
    };
    var ic = iconConfig[type] || iconConfig.info;

    // 先关闭已有的
    if (_confirmOverlay) _closeConfirm(false);

    return new Promise(function (resolve) {
      _confirmResolve = function (result) {
        resolve(result);
        if (result && _onConfirm) _onConfirm();
        if (!result && _onCancel) _onCancel();
      };

      var overlay = document.createElement('div');
      overlay.style.cssText = [
        'position:fixed; top:0; left:0; right:0; bottom:0;',
        'background:rgba(0,0,0,0.4);',
        'display:flex; align-items:center; justify-content:center;',
        'z-index:99998; opacity:0; transition:opacity 0.2s;'
      ].join('');

      var box = document.createElement('div');
      box.style.cssText = [
        'background:var(--color-bg-card, #fff);',
        'border-radius:' + 'var(--radius-xl, 10px);',
        'width:400px; max-width:90vw;',
        'box-shadow:' + 'var(--shadow-xl, 0 20px 25px -5px rgba(0,0,0,0.1));',
        'transform:scale(0.92); transition:transform 0.2s cubic-bezier(0.22,1,0.36,1);'
      ].join('');

      overlay.addEventListener('transitionend', function () {
        if (overlay.style.opacity === '1') box.style.transform = 'scale(1)';
      });

      // 头部
      var header = document.createElement('div');
      header.style.cssText = 'display:flex;align-items:flex-start;gap:12px;padding:20px 20px 16px;';

      var iconEl = document.createElement('div');
      iconEl.style.cssText = [
        'width:36px;height:36px;border-radius:50%;',
        'display:flex;align-items:center;justify-content:center;',
        'flex-shrink:0;font-size:16px;',
        'background:' + ic.bg + ';color:' + ic.color + ';'
      ].join('');
      var fa = document.createElement('span');
      fa.style.cssText = 'font-family:"FontAwesome";';
      fa.textContent = ic.icon;
      iconEl.appendChild(fa);
      header.appendChild(iconEl);

      var textWrap = document.createElement('div');
      textWrap.style.cssText = 'flex:1;min-width:0;';

      var titleEl = document.createElement('div');
      titleEl.style.cssText = 'font-size:' + 'var(--font-size-md, 16px)' + ';font-weight:' + 'var(--font-weight-semibold, 600)' + ';color:' + 'var(--color-text-primary, #1F2937)' + ';margin-bottom:4px;';
      titleEl.textContent = title;
      textWrap.appendChild(titleEl);

      var msgEl = document.createElement('div');
      msgEl.style.cssText = 'font-size:' + 'var(--font-size-sm, 13px)' + ';color:' + 'var(--color-text-secondary, #6B7280)' + ';line-height:' + 'var(--line-height-base, 1.5)' + ';';
      msgEl.textContent = message;
      textWrap.appendChild(msgEl);

      header.appendChild(textWrap);
      box.appendChild(header);

      // 底部
      var footer = document.createElement('div');
      footer.style.cssText = 'display:flex;justify-content:flex-end;gap:8px;padding:12px 20px 20px;';

      var btnBase = 'display:inline-flex;align-items:center;justify-content:center;gap:6px;height:34px;padding:0 16px;border-radius:' + 'var(--radius-md, 6px)' + ';font-size:' + 'var(--font-size-sm, 13px)' + ';font-weight:' + 'var(--font-weight-medium, 500)' + ';cursor:pointer;border:1px solid transparent;transition:all 0.15s;white-space:nowrap;outline:none;';

      var cancelBtn = document.createElement('button');
      cancelBtn.style.cssText = btnBase + 'background:' + 'var(--color-bg-card, #fff)' + ';color:' + 'var(--color-text-primary, #1F2937)' + ';border-color:' + 'var(--color-border-dark, #D1D5DB)' + ';';
      cancelBtn.textContent = cancelText;
      cancelBtn.addEventListener('mouseenter', function () {
        cancelBtn.style.borderColor = 'var(--color-primary, #2563EB)';
        cancelBtn.style.color = 'var(--color-primary, #2563EB)';
      });
      cancelBtn.addEventListener('mouseleave', function () {
        cancelBtn.style.borderColor = 'var(--color-border-dark, #D1D5DB)';
        cancelBtn.style.color = 'var(--color-text-primary, #1F2937)';
      });

      var confirmBtn = document.createElement('button');
      var isDanger = (type === 'danger');
      confirmBtn.style.cssText = btnBase + (isDanger
        ? 'background:' + 'var(--color-danger, #EF4444)' + ';color:#fff;border-color:' + 'var(--color-danger, #EF4444)' + ';'
        : 'background:' + 'var(--color-primary, #2563EB)' + ';color:#fff;border-color:' + 'var(--color-primary, #2563EB)' + ';');
      confirmBtn.textContent = confirmText;
      if (isDanger) {
        confirmBtn.addEventListener('mouseenter', function () { confirmBtn.style.opacity = '0.9'; });
        confirmBtn.addEventListener('mouseleave', function () { confirmBtn.style.opacity = '1'; });
      } else {
        confirmBtn.addEventListener('mouseenter', function () {
          confirmBtn.style.background = 'var(--color-primary-dark, #1D4ED8)';
          confirmBtn.style.borderColor = 'var(--color-primary-dark, #1D4ED8)';
        });
        confirmBtn.addEventListener('mouseleave', function () {
          confirmBtn.style.background = 'var(--color-primary, #2563EB)';
          confirmBtn.style.borderColor = 'var(--color-primary, #2563EB)';
        });
      }

      footer.appendChild(cancelBtn);
      footer.appendChild(confirmBtn);
      box.appendChild(footer);
      overlay.appendChild(box);
      document.body.appendChild(overlay);
      _confirmOverlay = overlay;

      // 事件
      cancelBtn.addEventListener('click', function () { _closeConfirm(false); });
      confirmBtn.addEventListener('click', function () { _closeConfirm(true); });
      overlay.addEventListener('click', function (e) { if (e.target === overlay) _closeConfirm(false); });

      // 动画
      requestAnimationFrame(function () { overlay.style.opacity = '1'; });
    });
  };

  // ESC 关闭
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && _confirmOverlay) _closeConfirm(false);
  });

  /** Loading 遮罩 */
  Common.showLoading = function (message) {
    Common.hideLoading();
    var overlay = Common.createEl('div', {
      'data-loading': 'true',
      style: {
        position: 'fixed', inset: '0', background: 'rgba(255,255,255,0.7)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        zIndex: '99997', gap: '12px'
      }
    });
    var spinner = Common.createEl('div', {
      style: { width: '36px', height: '36px', border: '3px solid #E5E7EB', borderTopColor: '#2563EB', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }
    });
    var text = Common.createEl('div', { style: { fontSize: '14px', color: '#6B7280' }, text: message || '加载中...' });
    overlay.appendChild(spinner);
    overlay.appendChild(text);
    if (!document.getElementById('common-spin-keyframes')) {
      var style = document.createElement('style');
      style.id = 'common-spin-keyframes';
      style.textContent = '@keyframes spin{to{transform:rotate(360deg)}}';
      document.head.appendChild(style);
    }
    document.body.appendChild(overlay);
  };

  Common.hideLoading = function () {
    Common.$$('[data-loading]').forEach(function (el) { el.remove(); });
  };

  /* ========== 本地存储 ========== */

  Common.storage = {
    get: function (key, defaultVal) {
      try {
        var val = localStorage.getItem(key);
        return val ? JSON.parse(val) : (defaultVal !== undefined ? defaultVal : null);
      } catch (e) { return defaultVal !== undefined ? defaultVal : null; }
    },
    set: function (key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
    },
    remove: function (key) { try { localStorage.removeItem(key); } catch (e) {} }
  };

  /* ========== 工具函数 ========== */

  /** 防抖 */
  Common.debounce = function (fn, delay) {
    var timer;
    return function () {
      var ctx = this, args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () { fn.apply(ctx, args); }, delay || 300);
    };
  };

  /** 节流 */
  Common.throttle = function (fn, delay) {
    var last = 0;
    return function () {
      var now = Date.now();
      if (now - last >= (delay || 200)) {
        last = now;
        fn.apply(this, arguments);
      }
    };
  };

  /** 深拷贝 */
  Common.deepClone = function (obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    return JSON.parse(JSON.stringify(obj));
  };

  /** 生成 ID */
  Common.uuid = function () {
    return 'id-' + Date.now() + '-' + Math.random().toString(36).slice(2, 9);
  };

  /** 获取 URL 查询参数 */
  Common.getQueryParam = function (name) {
    var params = new URLSearchParams(window.location.search);
    return params.get(name);
  };

  /** 获取所有查询参数 */
  Common.getAllQueryParams = function () {
    var params = {};
    new URLSearchParams(window.location.search).forEach(function (val, key) { params[key] = val; });
    return params;
  };

  /** 事件委托 */
  Common.on = function (el, event, selector, handler) {
    el.addEventListener(event, function (e) {
      var target = e.target.closest(selector);
      if (target && el.contains(target)) handler.call(target, e);
    });
  };

  /* ========== iframe 通信 ========== */

  /**
   * 子页面 → 父页面：请求切换 iframe 页面
   * @param {string} pageUrl 子页面文件名，如 "用户管理.html"
   * @param {string} [title] 可选的新页面标题
   */
  Common.navigateInParent = function (pageUrl, title) {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: 'navigate', page: pageUrl, title: title }, '*');
    }
  };

  /**
   * 父页面：监听子页面导航请求
   * @param {function} callback 回调，参数为 { page, title }
   */
  Common.onChildNavigate = function (callback) {
    window.addEventListener('message', function (e) {
      if (e.data && e.data.type === 'navigate') callback(e.data);
    });
  };

  /**
   * 子页面 → 父页面：更新父框架标题
   */
  Common.setParentTitle = function (title) {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: 'updateTitle', title: title }, '*');
    }
  };

  /* ========== 通用渲染辅助 ========== */

  /** 渲染空状态（自动适配 table/非 table 容器） */
  Common.renderEmpty = function (container, text) {
    if (typeof container === 'string') container = Common.$(container);
    if (!container) return;
    var innerHtml = '<div class="empty-state"><div class="empty-icon">📭</div><div class="empty-text">' +
      (text || '暂无数据') + '</div></div>';
    // 容器是 tbody 时包裹 tr>td 保持合法表格结构
    if (container.tagName === 'TBODY') {
      var colspan = '100';
      var table = container.closest('table');
      if (table) {
        var ths = table.querySelectorAll('thead th');
        if (ths.length > 0) colspan = ths.length;
      }
      innerHtml = '<tr><td colspan="' + colspan + '" style="text-align:center;padding:40px;">' + innerHtml + '</td></tr>';
    }
    container.innerHTML = innerHtml;
  };

  /**
   * 渲染分页
   * @param {string|HTMLElement} container  容器
   * @param {number}             currentPage 当前页
   * @param {number}             totalPages  总页数
   * @param {number}             total       总记录数
   * @param {function}           onPageChange 翻页回调
   * @param {object}             [options]   扩展选项
   *   - pageSize          当前每页条数
   *   - pageSizeOptions   可选条数列表，默认 [10,20,50,100]
   *   - onPageSizeChange  切换条数回调
   *   - showJumper        是否显示跳页输入框，默认 true
   */
  Common.renderPagination = function (container, currentPage, totalPages, total, onPageChange, options) {
    if (typeof container === 'string') container = Common.$('#' + container) || document.getElementById(container);
    if (!container || totalPages <= 0) { if (container) container.innerHTML = ''; return; }
    if (typeof onPageChange !== 'function') return;

    options = options || {};
    var pageSize = options.pageSize || 0;
    var sizeOpts = options.pageSizeOptions || [10, 20, 50, 100];
    var onSizeChange = options.onPageSizeChange;
    var showJumper = options.showJumper !== false;

    var html = '';

    // 每页条数选择器（靠左）
    if (pageSize > 0 && typeof onSizeChange === 'function') {
      html += '<div class="pagination-size"><span>每页</span><select onchange="window.__paginator.changeSize(this.value)">';
      for (var s = 0; s < sizeOpts.length; s++) {
        html += '<option value="' + sizeOpts[s] + '"' + (sizeOpts[s] === pageSize ? ' selected' : '') + '>' + sizeOpts[s] + '</option>';
      }
      html += '</select><span>条</span></div>';
    }

    // 上一页
    html += '<button class="pagination-btn prev" ' + (currentPage <= 1 ? 'disabled' : '') +
      ' onclick="window.__paginator.go(' + (currentPage - 1) + ')">上一页</button>';

    // 页码按钮（最多显示7个，超出加省略号）
    var pages = [];
    if (totalPages <= 7) {
      for (var i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      var start = Math.max(2, currentPage - 1);
      var end = Math.min(totalPages - 1, currentPage + 1);
      if (currentPage <= 3) end = Math.min(5, totalPages - 1);
      if (currentPage >= totalPages - 2) start = Math.max(totalPages - 4, 2);
      for (var j = start; j <= end; j++) pages.push(j);
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }

    for (var k = 0; k < pages.length; k++) {
      if (pages[k] === '...') {
        html += '<span class="pagination-btn ellipsis">...</span>';
      } else {
        html += '<button class="pagination-btn' + (pages[k] === currentPage ? ' active' : '') +
          '" onclick="window.__paginator.go(' + pages[k] + ')">' + pages[k] + '</button>';
      }
    }

    // 下一页
    html += '<button class="pagination-btn next" ' + (currentPage >= totalPages ? 'disabled' : '') +
      ' onclick="window.__paginator.go(' + (currentPage + 1) + ')">下一页</button>';

    // 总数
    html += '<span class="pagination-info">共 ' + Common.formatNumber(total) + ' 条</span>';

    // 跳页输入框
    if (showJumper && totalPages > 1) {
      html += '<div class="pagination-jump"><span>跳至</span>' +
        '<input type="number" min="1" max="' + totalPages + '" value="' + currentPage + '"' +
        ' onkeydown="window.__paginator.jump(event, this.value, ' + totalPages + ')">' +
        '<span>页</span></div>';
    }

    // 注册回调
    window.__paginator = {
      go: function (p) {
        if (p >= 1 && p <= totalPages && p !== currentPage) onPageChange(p);
      },
      changeSize: function (val) {
        var size = parseInt(val, 10);
        if (size > 0 && size !== pageSize) onSizeChange(size);
      },
      jump: function (e, val, max) {
        if (e.key === 'Enter' || e.keyCode === 13) {
          var p = parseInt(val, 10);
          if (isNaN(p)) return;
          p = Math.max(1, Math.min(max, p));
          if (p !== currentPage) onPageChange(p);
        }
      }
    };

    container.innerHTML = html;
  };

  /** 渲染加载骨架 */
  Common.renderSkeleton = function (container, rows) {
    if (typeof container === 'string') container = Common.$(container);
    if (!container) return;
    rows = rows || 5;
    var html = '';
    for (var i = 0; i < rows; i++) {
      html += '<div style="display:flex;gap:16px;padding:12px 0;border-bottom:1px solid #F3F4F6;">';
      html += '<div style="flex:1;height:20px;background:linear-gradient(90deg,#F3F4F6 25%,#E5E7EB 50%,#F3F4F6 75%);background-size:200% 100%;animation:common-skel 1.5s infinite;border-radius:4px;"></div>';
      html += '</div>';
    }
    container.innerHTML = html;
    if (!document.getElementById('common-skel-style')) {
      var style = document.createElement('style');
      style.id = 'common-skel-style';
      style.textContent = '@keyframes common-skel{0%{background-position:200% 0}100%{background-position:-200% 0}}';
      document.head.appendChild(style);
    }
  };

  /* ========== 字符计数器（输入框内右侧） ========== */

  /**
   * 为单个输入框/文本域绑定字符计数器，显示在输入框内部右侧，输入时实时更新。
   * 计数器会读取 maxlength 作为上限（或通过 options.maxLength 指定），显示格式：`当前/上限`；未设上限时仅显示字符数。
   * @param {HTMLElement|string} input 输入框元素或 CSS 选择器
   * @param {Object} [options] 可选配置
   * @param {number} [options.maxLength] 上限，缺省时读取 input 的 maxlength 属性
   * @param {boolean} [options.hideWhenEmpty] 输入为空时隐藏计数器，默认 false
   * @returns {HTMLElement|null} 包裹容器 .char-counter-wrap；重复绑定返回 null
   */
  Common.bindCharCounter = function (input, options) {
    options = options || {};
    if (typeof input === 'string') input = Common.$(input);
    if (!input || input.dataset.charCounterBound) return null;
    input.dataset.charCounterBound = '1';

    var max = options.maxLength != null ? options.maxLength : (parseInt(input.getAttribute('maxlength'), 10) || null);

    // 用相对定位容器包裹输入框
    var wrap = document.createElement('div');
    wrap.className = 'char-counter-wrap';
    input.parentNode.insertBefore(wrap, input);
    wrap.appendChild(input);

    // 计数器元素
    var counter = document.createElement('span');
    counter.className = 'char-counter';
    wrap.appendChild(counter);

    function update() {
      var len = input.value.length;
      counter.textContent = max ? len + '/' + max : String(len);
      counter.classList.toggle('is-full', !!(max && len >= max));
      wrap.classList.toggle('is-empty', !!(options.hideWhenEmpty && len === 0));
    }

    input.addEventListener('input', update);
    // 中文输入法组合结束再更新一次
    input.addEventListener('compositionend', update);
    update();
    return wrap;
  };

  /**
   * 批量绑定字符计数器。默认扫描页面中所有带 `data-char-counter` 属性的输入控件。
   * @param {string} [selector] 自定义选择器，默认 'input[data-char-counter], textarea[data-char-counter]'
   * @param {Object} [options] 同 bindCharCounter 的 options
   * @returns {number} 成功绑定的数量
   */
  Common.bindCharCounters = function (selector, options) {
    var list = Common.$$(selector || 'input[data-char-counter], textarea[data-char-counter]');
    var count = 0;
    list.forEach(function (el) { if (Common.bindCharCounter(el, options)) count++; });
    return count;
  };

  /** 导出全局 */
  window.Common = Common;
})(window);
