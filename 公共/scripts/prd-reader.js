/**
 * ========================================
 * prd-reader.js — PRD 文档阅读器组件
 * ========================================
 * 非侵入式：无需修改每个 HTML 页面，通过 common.js 自动加载。
 * 功能：右下角浮动按钮 → 侧滑面板 → Markdown 渲染 → 多文档 Tab 切换。
 *
 * PRD 文档使用纯 .md 格式存储于 prd/ 目录，通过 fetch() 加载。
 * - http:// 协议：fetch 正常加载 .md 文件内容
 * - file:// 协议：fetch 被阻止，面板中显示提示信息
 *
 * 依赖：
 *   - common.js（Common 工具库）
 *   - prd-map.js（PRD_MAP 映射表，每项为 { name, file } 结构）
 * ========================================
 */
(function (window, document) {
  'use strict';

  // ============ 样式自注入（插件内聚，不依赖外部样式文件） ============
  var _styleInjected = false;
  function injectStyles() {
    if (_styleInjected) return;
    _styleInjected = true;
    var style = document.createElement('style');
    style.id = 'prd-reader-styles';
    style.textContent = [
      '/* 浮动按钮 */',
      '.prd-reader-fab { position: fixed; right: 24px; bottom: 24px; width: 48px; height: 48px; border-radius: 50%; background: var(--color-primary, #2563EB); color: #fff; display: flex; align-items: center; justify-content: center; cursor: grab; z-index: 9000; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.35); transition: box-shadow 0.25s, background 0.15s; user-select: none; touch-action: none; }',
      '.prd-reader-fab:hover { box-shadow: 0 6px 20px rgba(37, 99, 235, 0.45); }',
      '.prd-reader-fab:active { cursor: grabbing; }',
      '.prd-reader-fab.dragging { cursor: grabbing; box-shadow: 0 8px 24px rgba(37, 99, 235, 0.5); opacity: 0.9; will-change: left, top; }',
      '.prd-reader-fab-icon { font-size: 20px; line-height: 1; }',
      '.prd-reader-fab-badge { position: absolute; top: -4px; right: -4px; min-width: 18px; height: 18px; padding: 0 5px; border-radius: 9px; background: var(--color-danger, #EF4444); color: #fff; font-size: 11px; font-weight: 600; display: flex; align-items: center; justify-content: center; line-height: 1; border: 2px solid var(--color-bg-card, #fff); }',
      '.prd-reader-fab-badge.zero { background: var(--color-border-dark, #D1D5DB); }',
      '',
      '/* 遮罩层 */',
      '.prd-reader-overlay { position: fixed; inset: 0; z-index: 9001; background: rgba(0, 0, 0, 0.3); opacity: 0; pointer-events: none; transition: opacity 0.3s; }',
      '.prd-reader-overlay.show { opacity: 1; pointer-events: auto; }',
      '',
      '/* 侧滑面板 */',
      '.prd-reader-panel { position: fixed; top: 0; right: 0; bottom: 0; width: 800px; min-width: 320px; max-width: 90vw; z-index: 9002; background: var(--color-bg-card, #fff); box-shadow: -4px 0 24px rgba(0, 0, 0, 0.1); display: flex; flex-direction: column; transform: translateX(100%); transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1); }',
      '.prd-reader-panel.show { transform: translateX(0); }',
      '',
      '/* 拖拽条 */',
      '.prd-reader-resizer { position: absolute; left: -3px; top: 0; bottom: 0; width: 6px; cursor: col-resize; z-index: 9003; display: flex; align-items: center; justify-content: center; }',
      '.prd-reader-resizer::before { content: ""; position: absolute; left: 2px; top: 0; bottom: 0; width: 2px; border-radius: 1px; background: transparent; transition: background 0.2s; }',
      '.prd-reader-resizer:hover::before { background: var(--color-primary, #2563EB); }',
      '.prd-reader-resizer::after { content: ""; width: 4px; height: 36px; border-radius: 2px; background: var(--color-border-dark, #D1D5DB); opacity: 0; transition: opacity 0.2s; }',
      '.prd-reader-resizer:hover::after { opacity: 1; }',
      '',
      '/* 头部 */',
      '.prd-reader-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid var(--color-border, #E5E7EB); flex-shrink: 0; position: relative; z-index: 1; }',
      '.prd-reader-title { display: flex; align-items: center; gap: 8px; font-size: 16px; font-weight: 600; color: var(--color-text-primary, #1F2937); }',
      '.prd-reader-header-actions { display: flex; align-items: center; gap: 8px; }',
      '.prd-reader-toggle-nav, .prd-reader-close { width: 28px; height: 28px; border: none; background: transparent; font-size: 20px; color: var(--color-text-secondary, #6B7280); cursor: pointer; border-radius: var(--radius-sm, 4px); display: flex; align-items: center; justify-content: center; transition: all 0.15s; }',
      '.prd-reader-toggle-nav { font-size: 18px; }',
      '.prd-reader-toggle-nav:hover, .prd-reader-close:hover { background: var(--color-bg-hover, #F3F4F6); color: var(--color-text-primary, #1F2937); }',
      '',
      '/* 视图切换器 */',
      '.prd-reader-view-switcher { display: inline-flex; border-radius: var(--radius-sm, 4px); overflow: hidden; border: 1px solid var(--color-border, #E5E7EB); }',
      '.prd-reader-view-btn { padding: 4px 12px; border: none; background: transparent; font-size: 13px; color: var(--color-text-secondary, #6B7280); cursor: pointer; transition: all 0.15s; white-space: nowrap; line-height: 1.4; outline: none; }',
      '.prd-reader-view-btn:hover { color: var(--color-primary, #2563EB); }',
      '.prd-reader-view-btn.active { background: var(--color-primary, #2563EB); color: #fff; }',
      '',
      '/* Tab 栏 */',
      '.prd-reader-tabs { display: flex; gap: 4px; padding: 8px 16px; border-bottom: 1px solid var(--color-border, #E5E7EB); flex-shrink: 0; overflow-x: auto; }',
      '.prd-reader-tabs::-webkit-scrollbar { height: 3px; }',
      '.prd-reader-tabs::-webkit-scrollbar-thumb { background: var(--color-border-dark, #D1D5DB); border-radius: 2px; }',
      '.prd-reader-tab { display: inline-flex; align-items: center; gap: 4px; padding: 6px 12px; border: 1px solid transparent; border-radius: var(--radius-sm, 4px); font-size: 13px; color: var(--color-text-secondary, #6B7280); background: transparent; cursor: pointer; white-space: nowrap; transition: all 0.15s; outline: none; }',
      '.prd-reader-tab:hover { background: var(--color-bg-hover, #F3F4F6); color: var(--color-text-primary, #1F2937); }',
      '.prd-reader-tab.active { background: var(--color-primary-bg, #DBEAFE); color: var(--color-primary, #2563EB); border-color: var(--color-primary-light, #BFDBFE); font-weight: 500; }',
      '',
      '/* 主体区域 */',
      '.prd-reader-body { flex: 1; display: flex; overflow: hidden; position: relative; }',
      '',
      '/* 目录导航栏 */',
      '.prd-reader-nav { width: 200px; flex-shrink: 0; border-right: 1px solid var(--color-border, #E5E7EB); display: flex; flex-direction: column; overflow: hidden; background: var(--color-bg-card, #fff); width: 0; transition: width 0.25s cubic-bezier(0.22, 1, 0.36, 1); }',
      '.prd-reader-nav.show { width: 200px; }',
      '.prd-reader-nav-title { padding: 10px 16px; font-size: 12px; font-weight: 600; color: var(--color-text-secondary, #6B7280); text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid var(--color-border-light, #F3F4F6); flex-shrink: 0; white-space: nowrap; }',
      '.prd-reader-nav-list { flex: 1; overflow-y: auto; padding: 8px 0; }',
      '.prd-reader-nav-list::-webkit-scrollbar { width: 4px; }',
      '.prd-reader-nav-list::-webkit-scrollbar-thumb { background: var(--color-border, #E5E7EB); border-radius: 2px; }',
      '.prd-reader-nav-item { display: block; padding: 5px 16px; font-size: 13px; line-height: 1.4; color: var(--color-text-secondary, #6B7280); text-decoration: none; cursor: pointer; border-left: 2px solid transparent; transition: all 0.15s; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }',
      '.prd-reader-nav-item:hover { color: var(--color-primary, #2563EB); background: var(--color-bg-hover, #F8F9FB); }',
      '.prd-reader-nav-item.active { color: var(--color-primary, #2563EB); border-left-color: var(--color-primary, #2563EB); background: var(--color-primary-bg, #DBEAFE); font-weight: 500; }',
      '.prd-reader-nav-item.toc-level-2 { padding-left: 28px; }',
      '.prd-reader-nav-item.toc-level-3 { padding-left: 40px; font-size: 12px; }',
      '.prd-reader-nav-item.toc-level-4, .prd-reader-nav-item.toc-level-5, .prd-reader-nav-item.toc-level-6 { padding-left: 52px; font-size: 12px; }',
      '.prd-reader-nav-empty { padding: 20px 16px; font-size: 13px; color: var(--color-text-placeholder, #9CA3AF); text-align: center; }',
      '',
      '/* 内容区 */',
      '.prd-reader-content { flex: 1; overflow-y: auto; padding: 20px 24px; font-size: 14px; line-height: 1.7; color: var(--color-text-primary, #1F2937); scroll-behavior: smooth; }',
      '.prd-reader-content::-webkit-scrollbar { width: 6px; }',
      '.prd-reader-content::-webkit-scrollbar-thumb { background: var(--color-border-dark, #D1D5DB); border-radius: 3px; }',
      '.prd-reader-content::-webkit-scrollbar-track { background: transparent; }',
      '',
      '/* Loading / Empty */',
      '.prd-reader-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; padding: 60px 0; color: var(--color-text-secondary, #6B7280); }',
      '.prd-reader-spinner { width: 28px; height: 28px; border: 2.5px solid var(--color-border, #E5E7EB); border-top-color: var(--color-primary, #2563EB); border-radius: 50%; animation: spin 0.6s linear infinite; }',
      '.prd-reader-empty { text-align: center; padding: 60px 20px; color: var(--color-text-placeholder, #9CA3AF); font-size: 14px; }',
      '',
      '/* 错误提示 */',
      '.prd-reader-error { text-align: center; padding: 40px 24px; color: var(--color-text-secondary, #6B7280); font-size: 14px; line-height: 1.7; }',
      '.prd-reader-error-icon { font-size: 36px; margin-bottom: 12px; }',
      '.prd-reader-error p { margin: 8px 0; }',
      '.prd-reader-error code { font-family: "Consolas", monospace; font-size: 0.9em; padding: 2px 6px; background: var(--color-bg-hover, #F3F4F6); border-radius: 3px; color: var(--color-danger, #EF4444); }',
      '',
      '/* Markdown 源码模式 */',
      '.prd-reader-raw { margin: 0; padding: 16px 20px; background: #1E293B; border-radius: 0; min-height: 100%; overflow: auto; white-space: pre-wrap; word-break: break-word; }',
      '.prd-reader-raw code { font-family: "Fira Code", "Cascadia Code", "JetBrains Mono", "Consolas", monospace; font-size: 13px; line-height: 1.7; color: #E2E8F0; }',
      '',
      '/* Markdown 渲染样式 */',
      '.prd-md-h { margin: 20px 0 10px; font-weight: 600; color: var(--color-text-primary, #1F2937); line-height: 1.4; scroll-margin-top: 12px; }',
      '.prd-md-h1 { font-size: 22px; border-bottom: 2px solid var(--color-border-light, #F3F4F6); padding-bottom: 8px; margin-top: 0; }',
      '.prd-md-h2 { font-size: 18px; border-bottom: 1px solid var(--color-border-light, #F3F4F6); padding-bottom: 6px; }',
      '.prd-md-h3 { font-size: 16px; }',
      '.prd-md-h4 { font-size: 14px; }',
      '.prd-md-h5, .prd-md-h6 { font-size: 13px; color: var(--color-text-secondary, #6B7280); }',
      '.prd-md-p { margin: 8px 0; }',
      '.prd-md-p:empty { display: none; }',
      '.prd-md-ul, .prd-md-ol { margin: 8px 0; padding-left: 24px; }',
      '.prd-md-ul { list-style: disc; }',
      '.prd-md-ol { list-style: decimal; }',
      '.prd-md-ul li, .prd-md-ol li { margin: 4px 0; }',
      '.prd-md-hr { border: none; border-top: 1px solid var(--color-border-light, #F3F4F6); margin: 16px 0; }',
      '.prd-md-quote { margin: 8px 0; padding: 8px 16px; border-left: 3px solid var(--color-primary, #2563EB); background: var(--color-bg-hover, #F8F9FB); color: var(--color-text-secondary, #6B7280); border-radius: 0 var(--radius-sm, 4px) var(--radius-sm, 4px) 0; }',
      '.prd-md-pre { margin: 12px 0; padding: 12px 16px; background: #1E293B; border-radius: var(--radius-md, 6px); overflow-x: auto; }',
      '.prd-md-pre code { font-family: "Fira Code", "Cascadia Code", "JetBrains Mono", "Consolas", monospace; font-size: 13px; line-height: 1.6; color: #E2E8F0; white-space: pre; }',
      '.prd-md-code { font-family: "Fira Code", "Consolas", monospace; font-size: 0.88em; padding: 1px 5px; background: var(--color-bg-hover, #F3F4F6); border-radius: 3px; color: var(--color-danger, #EF4444); }',
      '.prd-md-table { width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 13px; display: block; overflow-x: auto; }',
      '.prd-md-table th, .prd-md-table td { padding: 6px 12px; border: 1px solid var(--color-border, #E5E7EB); text-align: left; white-space: nowrap; }',
      '.prd-md-table th { background: var(--color-bg-hover, #F3F4F6); font-weight: 600; color: var(--color-text-secondary, #6B7280); }',
      '.prd-md-table tbody tr:hover { background: var(--color-bg-hover, #F8F9FB); }',
      '.prd-md-link { color: var(--color-primary, #2563EB); text-decoration: none; }',
      '.prd-md-link:hover { text-decoration: underline; }'
    ].join('\n');
    document.head.appendChild(style);
  }

  // 已加载的 .md 内容缓存（以 file 路径为 key）
  var _loadedContent = {};

  // 当前页面对应的 PRD 文档列表（每项 { name, file }）
  var _currentPageDocs = [];

  // 当前激活的文档索引（_currentPageDocs 数组下标）
  var _activeDocIndex = 0;

  // 面板是否已创建
  var _panelCreated = false;

  // 面板是否打开
  var _panelOpen = false;

  // 视图模式：'preview' 渲染预览 / 'markdown' 原始 Markdown
  var _viewMode = 'preview';

  // ============ 路径推导 ============
  // 当前页面相对项目根目录的路径，如 '管理端/用户管理.html'
  // 注意：file:// 协议下 window.location.pathname 中的中文会被 URL 编码，
  // 必须先 decodeURIComponent 再做路径匹配
  function getCurrentPagePath() {
    var rawPath = window.location.pathname;
    var path;
    try { path = decodeURIComponent(rawPath); } catch (e) { path = rawPath; }
    path = path.replace(/\\/g, '/');

    var parts = path.split('/');
    var rootIdx = -1;
    for (var i = 0; i < parts.length; i++) {
      if (parts[i] === 'prototype-template') { rootIdx = i; break; }
    }
    if (rootIdx >= 0 && rootIdx < parts.length - 1) {
      return parts.slice(rootIdx + 1).join('/');
    }
    return parts.slice(-2).filter(function (s) { return s; }).join('/');
  }

  // 获取项目根目录的相对路径前缀
  // 从自身 <script src> 推导：src 形如 '../公共/scripts/prd-reader.js'
  // 去掉 '公共/scripts/prd-reader.js' 后剩余的 '../' 即为根前缀
  function getRootBase() {
    var scripts = document.getElementsByTagName('script');
    for (var i = 0; i < scripts.length; i++) {
      var src = scripts[i].getAttribute('src') || '';
      if (/prd-reader\.js/.test(src)) {
        var idx = src.indexOf('公共/scripts/prd-reader.js');
        if (idx > 0) return src.substring(0, idx);
        idx = src.lastIndexOf('/');
        if (idx > 0) return src.substring(0, idx + 1).replace(/公共\/scripts\/$/, '');
      }
    }
    return '';
  }

  // ============ Markdown 渲染器（轻量级） ============
  var _headings = [];
  var _headingSeq = 0;

  function escapeAttr(str) {
    return str.replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function resetHeadings() {
    _headings = [];
    _headingSeq = 0;
  }

  function renderMarkdown(md) {
    if (!md) return '';
    // 统一换行符：将 CRLF (\r\n) 和单独的 \r 转换为 \n
    // 防止 Windows CRLF 文件中每行末尾残留 \r 导致正则匹配失败
    md = md.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    var lines = md.split('\n');
    var html = [];
    var inCodeBlock = false;
    var inTable = false;
    var tableHeaderParsed = false;
    var codeLang = '';
    var listType = '';

    function escapeHtml(str) {
      return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function inlineMd(text) {
      // 1. 先提取行内代码，用占位符替换，避免后续转义破坏
      var codePlaceholders = [];
      text = text.replace(/`([^`]+)`/g, function (m, p1) {
        codePlaceholders.push('<code class="prd-md-code">' + escapeHtml(p1) + '</code>');
        return '\u0000CODE' + (codePlaceholders.length - 1) + '\u0000';
      });
      // 2. 转义 HTML 标签字符，防止 .md 中的 HTML 标签被 innerHTML 执行
      text = escapeHtml(text);
      // 3. 处理 Markdown 行内语法
      text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
      text = text.replace(/(^|[^*])\*([^*]+)\*/g, '$1<em>$2</em>');
      text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" class="prd-md-link">$1</a>');
      // 4. 还原行内代码
      text = text.replace(/\u0000CODE(\d+)\u0000/g, function (m, idx) {
        return codePlaceholders[parseInt(idx)];
      });
      return text;
    }

    function closeList() {
      if (listType) { html.push('</' + listType + '>'); listType = ''; }
    }
    function closeTable() {
      if (inTable) { html.push('</tbody></table>'); inTable = false; tableHeaderParsed = false; }
    }

    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];

      // 代码块：支持前导空白（如列表项内缩进的 ```）和引用块前缀（> ```）
      // 先去掉行首空白和 > 前缀后检测 ```
      var lineForCodeCheck = line.replace(/^>\s?/, '').replace(/^\s+/, '');
      var codeMatch = lineForCodeCheck.match(/^```\s*(.*)$/);
      if (codeMatch) {
        if (inCodeBlock) {
          html.push('</code></pre>');
          inCodeBlock = false; codeLang = '';
        } else {
          closeList(); closeTable();
          codeLang = codeMatch[1].trim();
          html.push('<pre class="prd-md-pre' + (codeLang ? ' lang-' + codeLang : '') + '"><code>');
          inCodeBlock = true;
        }
        continue;
      }
      if (inCodeBlock) {
        // 代码块内的行也去掉前导空白和 > 前缀（统一缩进）
        html.push(escapeHtml(line.replace(/^>\s?/, '').replace(/^\s+/, '')));
        continue;
      }

      // 标题
      var hMatch = line.match(/^(#{1,6})\s+(.*)$/);
      if (hMatch) {
        closeList(); closeTable();
        var level = hMatch[1].length;
        var titleText = hMatch[2].replace(/\*\*/g, '').replace(/\*/g, '').trim();
        html.push('<h' + level + ' id="prd-toc-' + _headingSeq + '" class="prd-md-h prd-md-h' + level + '" data-toc-level="' + level + '" data-toc-text="' + escapeAttr(titleText) + '">' + inlineMd(hMatch[2]) + '</h' + level + '>');
        _headings.push({ id: 'prd-toc-' + _headingSeq, level: level, text: titleText });
        _headingSeq++;
        continue;
      }

      // 水平分割线
      if (/^---+\s*$/.test(line)) { closeList(); closeTable(); html.push('<hr class="prd-md-hr">'); continue; }

      // 表格
      if (/^\|.*\|/.test(line)) {
        closeList();
        if (/^\|[\s:|-]+\|$/.test(line)) { tableHeaderParsed = true; continue; }
        var cells = line.replace(/^\|/, '').replace(/\|$/, '').split('|').map(function (c) { return c.trim(); });
        if (!inTable) {
          html.push('<table class="prd-md-table"><thead><tr>');
          cells.forEach(function (c) { html.push('<th>' + inlineMd(c) + '</th>'); });
          html.push('</tr></thead><tbody>');
          inTable = true; tableHeaderParsed = true;
          continue;
        }
        html.push('<tr>');
        cells.forEach(function (c) { html.push('<td>' + inlineMd(c) + '</td>'); });
        html.push('</tr>');
        continue;
      } else { closeTable(); }

      // 无序列表
      var ulMatch = line.match(/^(\s*)[-*]\s+(.*)$/);
      if (ulMatch) {
        if (listType !== 'ul') { closeList(); html.push('<ul class="prd-md-ul">'); listType = 'ul'; }
        html.push('<li>' + inlineMd(ulMatch[2]) + '</li>');
        continue;
      }
      // 有序列表
      var olMatch = line.match(/^(\s*)\d+\.\s+(.*)$/);
      if (olMatch) {
        if (listType !== 'ol') { closeList(); html.push('<ol class="prd-md-ol">'); listType = 'ol'; }
        html.push('<li>' + inlineMd(olMatch[2]) + '</li>');
        continue;
      }
      // 引用
      var bqMatch = line.match(/^>\s*(.*)$/);
      if (bqMatch) {
        closeList();
        html.push('<blockquote class="prd-md-quote">' + inlineMd(bqMatch[1]) + '</blockquote>');
        continue;
      }
      // 空行
      if (line.trim() === '') { closeList(); continue; }
      // 段落
      closeList();
      html.push('<p class="prd-md-p">' + inlineMd(line) + '</p>');
    }

    if (inCodeBlock) html.push('</code></pre>');
    closeList(); closeTable();
    return html.join('\n');
  }

  // ============ 加载 .md 文件 ============
  // doc 为 { name, file } 结构，以 file 路径作为缓存 key
  function loadPrdFile(doc, callback) {
    var filePath = doc.file;

    // 已缓存
    if (_loadedContent[filePath]) { callback(_loadedContent[filePath]); return; }

    var rootBase = getRootBase();
    var src = rootBase + filePath;

    // 用 fetch 加载 .md 文件
    if (typeof fetch === 'function') {
      fetch(src)
        .then(function (res) {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          return res.text();
        })
        .then(function (text) {
          // 统一换行符为 LF，防止 CRLF 文件导致正则匹配异常
          text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
          _loadedContent[filePath] = text;
          callback(text);
        })
        .catch(function () {
          callback(null);
        });
    } else {
      callback(null);
    }
  }

  // ============ 浮动按钮 + 侧滑面板 ============

  function createFloatingButton() {
    if (document.getElementById('prd-reader-fab')) return;
    var fab = document.createElement('div');
    fab.id = 'prd-reader-fab';
    fab.className = 'prd-reader-fab';
    var docCount = _currentPageDocs.length;
    fab.innerHTML = '<span class="prd-reader-fab-icon"><i class="fa fa-file-text-o"></i></span>' +
      '<span class="prd-reader-fab-badge' + (docCount === 0 ? ' zero' : '') + '">' + docCount + '</span>';
    fab.title = docCount > 0 ? '查看 PRD 文档（' + docCount + ' 篇）' : '查看 PRD 文档（暂无关联文档）';
    document.body.appendChild(fab);

    // ============ 拖拽浮动按钮 ============
    var isDragging = false;
    var hasMoved = false;
    var startX = 0, startY = 0;
    var startLeft = 0, startTop = 0;
    var fabW = 0, fabH = 0, maxLeft = 0, maxTop = 0;
    var rafId = null;

    // 拖拽时屏蔽 iframe 的鼠标事件，防止鼠标移入 iframe 后父文档收不到 mousemove
    function setIframePassthrough(blocked) {
      var iframes = document.getElementsByTagName('iframe');
      for (var i = 0; i < iframes.length; i++) {
        iframes[i].style.pointerEvents = blocked ? 'none' : '';
      }
    }

    fab.addEventListener('mousedown', function (e) {
      if (e.button !== 0) return;
      isDragging = true;
      hasMoved = false;
      startX = e.clientX;
      startY = e.clientY;
      var rect = fab.getBoundingClientRect();
      startLeft = rect.left;
      startTop = rect.top;
      fabW = fab.offsetWidth;
      fabH = fab.offsetHeight;
      maxLeft = window.innerWidth - fabW;
      maxTop = window.innerHeight - fabH;
      fab.classList.add('dragging');
      fab.style.right = 'auto';
      fab.style.bottom = 'auto';
      fab.style.left = startLeft + 'px';
      fab.style.top = startTop + 'px';
      setIframePassthrough(true);
      e.preventDefault();
    });

    document.addEventListener('mousemove', function (e) {
      if (!isDragging) return;
      var dx = e.clientX - startX;
      var dy = e.clientY - startY;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) hasMoved = true;
      var newLeft = startLeft + dx;
      var newTop = startTop + dy;
      if (newLeft < 0) newLeft = 0;
      if (newTop < 0) newTop = 0;
      if (newLeft > maxLeft) newLeft = maxLeft;
      if (newTop > maxTop) newTop = maxTop;
      var targetLeft = newLeft;
      var targetTop = newTop;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(function () {
        fab.style.left = targetLeft + 'px';
        fab.style.top = targetTop + 'px';
        rafId = null;
      });
    });

    document.addEventListener('mouseup', function () {
      if (isDragging) {
        isDragging = false;
        fab.classList.remove('dragging');
        setIframePassthrough(false);
        if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
      }
    });

    // 点击打开面板（仅在未拖动时生效）
    fab.addEventListener('click', function (e) {
      if (hasMoved) { hasMoved = false; return; }
      if (_panelOpen) closePanel(); else openPanel();
    });

    // 触摸设备支持
    fab.addEventListener('touchstart', function (e) {
      if (e.touches.length !== 1) return;
      var touch = e.touches[0];
      isDragging = true;
      hasMoved = false;
      startX = touch.clientX;
      startY = touch.clientY;
      var rect = fab.getBoundingClientRect();
      startLeft = rect.left;
      startTop = rect.top;
      fabW = fab.offsetWidth;
      fabH = fab.offsetHeight;
      maxLeft = window.innerWidth - fabW;
      maxTop = window.innerHeight - fabH;
      fab.classList.add('dragging');
      fab.style.right = 'auto';
      fab.style.bottom = 'auto';
      fab.style.left = startLeft + 'px';
      fab.style.top = startTop + 'px';
      setIframePassthrough(true);
    }, { passive: true });

    document.addEventListener('touchmove', function (e) {
      if (!isDragging || e.touches.length !== 1) return;
      var touch = e.touches[0];
      var dx = touch.clientX - startX;
      var dy = touch.clientY - startY;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) hasMoved = true;
      var newLeft = startLeft + dx;
      var newTop = startTop + dy;
      if (newLeft < 0) newLeft = 0;
      if (newTop < 0) newTop = 0;
      if (newLeft > maxLeft) newLeft = maxLeft;
      if (newTop > maxTop) newTop = maxTop;
      var targetLeft = newLeft;
      var targetTop = newTop;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(function () {
        fab.style.left = targetLeft + 'px';
        fab.style.top = targetTop + 'px';
        rafId = null;
      });
      e.preventDefault();
    }, { passive: false });

    document.addEventListener('touchend', function () {
      if (isDragging) {
        isDragging = false;
        fab.classList.remove('dragging');
        setIframePassthrough(false);
        if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
      }
    });
  }

  function createPanel() {
    if (_panelCreated) return;
    _panelCreated = true;

    var overlay = document.createElement('div');
    overlay.id = 'prd-reader-overlay';
    overlay.className = 'prd-reader-overlay';
    overlay.addEventListener('click', function () { closePanel(); });

    var panel = document.createElement('div');
    panel.id = 'prd-reader-panel';
    panel.className = 'prd-reader-panel';

    // 拖拽条（面板左边缘）
    var resizer = document.createElement('div');
    resizer.id = 'prd-reader-resizer';
    resizer.className = 'prd-reader-resizer';
    resizer.title = '拖拽调整宽度';

    // 头部
    var header = document.createElement('div');
    header.className = 'prd-reader-header';
    header.innerHTML =
      '<div class="prd-reader-title">' +
        '<span>PRD 文档</span>' +
      '</div>' +
      '<div class="prd-reader-header-actions">' +
        '<button class="prd-reader-toggle-nav" title="切换目录">&#9776;</button>' +
        '<div class="prd-reader-view-switcher">' +
          '<button class="prd-reader-view-btn active" data-mode="preview">预览</button>' +
          '<button class="prd-reader-view-btn" data-mode="markdown">Markdown</button>' +
        '</div>' +
        '<button class="prd-reader-close" title="关闭">&times;</button>' +
      '</div>';
    header.querySelector('.prd-reader-close').addEventListener('click', function () { closePanel(); });
    header.querySelector('.prd-reader-toggle-nav').addEventListener('click', function () {
      var nav = document.getElementById('prd-reader-nav');
      if (nav) nav.classList.toggle('show');
    });
    var viewBtns = header.querySelectorAll('.prd-reader-view-btn');
    viewBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var mode = btn.getAttribute('data-mode');
        if (mode === _viewMode) return;
        _viewMode = mode;
        updateViewToggle();
        updateNavVisibility();
        renderContent();
      });
    });

    // Tab 栏
    var tabBar = document.createElement('div');
    tabBar.className = 'prd-reader-tabs';
    tabBar.id = 'prd-reader-tabs';

    // 主体区域（导航 + 内容）
    var body = document.createElement('div');
    body.className = 'prd-reader-body';

    // 导航栏（目录）
    var nav = document.createElement('nav');
    nav.id = 'prd-reader-nav';
    nav.className = 'prd-reader-nav';
    nav.innerHTML = '<div class="prd-reader-nav-title">目录</div><div class="prd-reader-nav-list" id="prd-reader-nav-list"></div>';

    // 内容区
    var content = document.createElement('div');
    content.className = 'prd-reader-content';
    content.id = 'prd-reader-content';

    body.appendChild(nav);
    body.appendChild(content);

    panel.appendChild(resizer);
    panel.appendChild(header);
    panel.appendChild(tabBar);
    panel.appendChild(body);

    document.body.appendChild(overlay);
    document.body.appendChild(panel);

    // 拖拽调整宽度
    initResizer();
  }

  // ============ 拖拽调整宽度 ============
  function initResizer() {
    var resizer = document.getElementById('prd-reader-resizer');
    var panel = document.getElementById('prd-reader-panel');
    if (!resizer || !panel) return;

    var isResizing = false;
    var startX = 0;
    var startWidth = 0;

    resizer.addEventListener('mousedown', function (e) {
      isResizing = true;
      startX = e.clientX;
      startWidth = panel.offsetWidth;
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      e.preventDefault();
    });

    document.addEventListener('mousemove', function (e) {
      if (!isResizing) return;
      // 面板从右滑出，向左拖 → 宽度增大
      var delta = startX - e.clientX;
      var newWidth = startWidth + delta;
      // 限制范围：320px ~ window.innerWidth * 0.85
      var maxWidth = Math.floor(window.innerWidth * 0.85);
      if (newWidth < 320) newWidth = 320;
      if (newWidth > maxWidth) newWidth = maxWidth;
      panel.style.width = newWidth + 'px';
    });

    document.addEventListener('mouseup', function () {
      if (isResizing) {
        isResizing = false;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      }
    });
  }

  // ============ 目录导航 ============
  function renderNav() {
    var navList = document.getElementById('prd-reader-nav-list');
    if (!navList) return;
    navList.innerHTML = '';

    if (_headings.length === 0) {
      navList.innerHTML = '<div class="prd-reader-nav-empty">暂无目录</div>';
      return;
    }

    _headings.forEach(function (h) {
      var item = document.createElement('a');
      item.className = 'prd-reader-nav-item toc-level-' + h.level;
      item.textContent = h.text;
      item.href = '#' + h.id;
      item.addEventListener('click', function (e) {
        e.preventDefault();
        var target = document.getElementById(h.id);
        if (target) {
          // 滚动内容区到标题位置
          var content = document.getElementById('prd-reader-content');
          if (content) {
            content.scrollTo({ top: target.offsetTop - 12, behavior: 'smooth' });
          }
        }
        // 高亮当前项
        var items = navList.querySelectorAll('.prd-reader-nav-item');
        items.forEach(function (el) { el.classList.remove('active'); });
        item.classList.add('active');
      });
      navList.appendChild(item);
    });

    // 滚动联动高亮
    var content = document.getElementById('prd-reader-content');
    if (content) {
      content.addEventListener('scroll', updateActiveNav);
    }
  }

  function updateActiveNav() {
    var content = document.getElementById('prd-reader-content');
    var navList = document.getElementById('prd-reader-nav-list');
    if (!content || !navList) return;

    var scrollTop = content.scrollTop;
    var activeId = null;

    for (var i = 0; i < _headings.length; i++) {
      var el = document.getElementById(_headings[i].id);
      if (el && el.offsetTop - 20 <= scrollTop) {
        activeId = _headings[i].id;
      }
    }

    var items = navList.querySelectorAll('.prd-reader-nav-item');
    items.forEach(function (el) {
      el.classList.toggle('active', el.getAttribute('href') === '#' + activeId);
    });

    // 滚动导航到当前项
    var activeItem = navList.querySelector('.prd-reader-nav-item.active');
    if (activeItem) {
      var navRect = navList.getBoundingClientRect();
      var itemRect = activeItem.getBoundingClientRect();
      if (itemRect.top < navRect.top || itemRect.bottom > navRect.bottom) {
        navList.scrollTop = activeItem.offsetTop - navRect.height / 2;
      }
    }
  }

  // 更新视图切换按钮高亮状态
  function updateViewToggle() {
    var btns = document.querySelectorAll('.prd-reader-view-btn');
    btns.forEach(function (btn) {
      var mode = btn.getAttribute('data-mode');
      btn.classList.toggle('active', mode === _viewMode);
    });
  }

  // 根据视图模式控制目录导航栏的显示/隐藏
  // preview 模式 → 显示目录，markdown 模式 → 隐藏目录
  function updateNavVisibility() {
    var nav = document.getElementById('prd-reader-nav');
    if (!nav) return;
    if (_viewMode === 'preview') {
      nav.classList.add('show');
    } else {
      nav.classList.remove('show');
    }
  }

  // 获取文档显示名称：name 有值时用 name，否则从 file 路径解析文件名
  function getDocName(doc) {
    if (doc.name && doc.name.trim()) return doc.name;
    var file = doc.file || '';
    // 去掉路径前缀和扩展名：'prd/user-management.md' → 'user-management'
    var name = file.split('/').pop();
    name = name.replace(/\.md$/i, '').replace(/\.markdown$/i, '');
    return name || '未命名文档';
  }

  function renderTabs() {
    var tabBar = document.getElementById('prd-reader-tabs');
    if (!tabBar) return;
    tabBar.innerHTML = '';

    _currentPageDocs.forEach(function (doc, index) {
      var tab = document.createElement('button');
      tab.className = 'prd-reader-tab' + (index === _activeDocIndex ? ' active' : '');
      tab.textContent = getDocName(doc);
      tab.addEventListener('click', function () {
        _activeDocIndex = index;
        renderTabs();
        renderContent();
      });
      tabBar.appendChild(tab);
    });
  }

  function renderContent() {
    var content = document.getElementById('prd-reader-content');
    if (!content) return;
    if (!_currentPageDocs[_activeDocIndex]) {
      resetHeadings();
      content.innerHTML = '<div class="prd-reader-empty">当前页面暂无关联的 PRD 文档<br><span style="font-size:12px;color:var(--color-text-placeholder,#9CA3AF)">请在 prd-map.js 中为该页面添加文档关联</span></div>';
      renderNav();
      return;
    }

    var renderDoc = _currentPageDocs[_activeDocIndex];
    var renderIndex = _activeDocIndex;
    content.innerHTML = '<div class="prd-reader-loading"><div class="prd-reader-spinner"></div><span>加载中...</span></div>';

    loadPrdFile(renderDoc, function (md) {
      // 防止异步回调时已切换到其他 Tab
      if (_activeDocIndex !== renderIndex) return;
      if (md) {
        if (_viewMode === 'markdown') {
          // Markdown 源码模式
          resetHeadings();
          content.innerHTML = '<pre class="prd-reader-raw"><code></code></pre>';
          var codeEl = content.querySelector('code');
          if (codeEl) codeEl.textContent = md;
          renderNav();
          content.scrollTop = 0;
        } else {
          // 渲染预览模式
          resetHeadings();
          content.innerHTML = renderMarkdown(md);
          renderNav();
          content.scrollTop = 0;
        }
      } else {
        // fetch 失败，通常是 file:// 协议
        var isFile = window.location.protocol === 'file:';
        content.innerHTML =
          '<div class="prd-reader-error">' +
            '<div class="prd-reader-error-icon">&#9888;</div>' +
            '<p><strong>无法加载 PRD 文档</strong></p>' +
            (isFile
              ? '<p>当前使用 <code>file://</code> 协议打开，浏览器安全策略阻止了 .md 文件加载。</p>' +
                '<p>请使用本地服务器打开，如：</p>' +
                '<pre class="prd-md-pre"><code># Python 3\npython -m http.server 8080\n\n# Node.js\nnpx serve .</code></pre>' +
                '<p>然后访问 <code>http://localhost:8080</code></p>'
              : '<p>文件路径：<code>' + renderDoc.file + '</code></p>' +
                '<p>请检查文件是否存在及路径是否正确。</p>') +
          '</div>';
        renderNav();
      }
    });
  }

  function openPanel() {
    createPanel();
    updateViewToggle();
    updateNavVisibility();
    renderTabs();
    renderContent();
    var overlay = document.getElementById('prd-reader-overlay');
    var panel = document.getElementById('prd-reader-panel');
    if (overlay) overlay.classList.add('show');
    if (panel) panel.classList.add('show');
    _panelOpen = true;
  }

  function closePanel() {
    var overlay = document.getElementById('prd-reader-overlay');
    var panel = document.getElementById('prd-reader-panel');
    if (overlay) overlay.classList.remove('show');
    if (panel) panel.classList.remove('show');
    _panelOpen = false;
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && _panelOpen) closePanel();
  });

  // ============ 初始化 ============
  function init() {
    if (typeof PRD_MAP === 'undefined') return;
    // 只在顶层窗口创建浮动按钮，避免 iframe 子页面重复创建
    if (window.top !== window.self) return;

    injectStyles();

    // 检测当前页面或 iframe 子页面的路径，匹配 PRD 文档
    updateCurrentDocs();

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () {
        createFloatingButton();
        watchIframeChanges();
      });
    } else {
      createFloatingButton();
      watchIframeChanges();
    }
  }

  // 根据当前页面路径或 iframe 子页面路径匹配 PRD 文档
  function updateCurrentDocs() {
    var pagePath = getCurrentPagePath();
    var docs = PRD_MAP[pagePath];

    // 模糊匹配：按文件名兜底
    if (!docs) {
      var fileName = pagePath.split('/').pop();
      for (var key in PRD_MAP) {
        if (key.split('/').pop() === fileName) { docs = PRD_MAP[key]; break; }
      }
    }

    // 如果当前页面没有匹配，检查是否有 iframe，用 iframe 子页面路径匹配
    if (!docs) {
      var iframe = getMainFrame();
      if (iframe) {
        var iframeSrc = iframe.getAttribute('src') || '';
        if (iframeSrc) {
          // iframe src 形如 '仪表盘.html'，需要拼接当前页面所在的端目录
          var dir = pagePath.substring(0, pagePath.lastIndexOf('/'));
          var iframePath = dir ? dir + '/' + iframeSrc : iframeSrc;
          docs = PRD_MAP[iframePath];
          // 模糊匹配
          if (!docs) {
            var ifName = iframeSrc.split('/').pop();
            for (var key2 in PRD_MAP) {
              if (key2.split('/').pop() === ifName) { docs = PRD_MAP[key2]; break; }
            }
          }
        }
      }
    }

    _currentPageDocs = docs || [];
    _activeDocIndex = 0;
  }

  // 查找页面中的主 iframe（框架页才有）
  function getMainFrame() {
    var iframes = document.getElementsByTagName('iframe');
    for (var i = 0; i < iframes.length; i++) {
      // 取第一个有 src 的 iframe 作为主框架
      if (iframes[i].getAttribute('src')) return iframes[i];
    }
    return null;
  }

  // 监听 iframe 切换页面，更新浮动按钮和面板内容
  function watchIframeChanges() {
    var iframe = getMainFrame();
    if (!iframe) return;

    // iframe 加载完成时更新文档列表
    iframe.addEventListener('load', function () {
      updateCurrentDocs();
      updateFabBadge();
      // 如果面板已打开，刷新 Tab 和内容
      if (_panelOpen) {
        renderTabs();
        renderContent();
      }
    });
  }

  // 更新浮动按钮角标数量
  function updateFabBadge() {
    var badge = document.querySelector('.prd-reader-fab-badge');
    if (!badge) return;
    var count = _currentPageDocs.length;
    badge.textContent = count;
    badge.classList.toggle('zero', count === 0);
    var fab = document.getElementById('prd-reader-fab');
    if (fab) {
      fab.title = count > 0 ? '查看 PRD 文档（' + count + ' 篇）' : '查看 PRD 文档（暂无关联文档）';
    }
  }

  init();

  window.PRDReader = {
    init: init,
    open: openPanel,
    close: closePanel,
    renderMarkdown: renderMarkdown
  };

})(window, document);
