# 原型设计工程模版

> 纯 HTML/JS/CSS 技术栈，双击即开，按端分目录，iframe 框架导航，Font Awesome + ECharts 本地化离线可用。

## 快速开始

双击根目录 `index.html` 打开导航入口页，选择对应端即可：

```
index.html              → 导航入口页（5个端入口卡片）
管理端/index.html        → 后台管理界面
运营端/index.html        → 运营分析界面
用户端/index.html        → 商城用户界面
手机端/登录.html          → 移动端登录页（登录后进入手机端首页）
登录.html                → Web 登录页（登录后跳转根目录 index.html）
```

## 目录结构

```
prototype-template/
│
├── index.html                         → 导航入口页（5端卡片入口）
├── 登录.html                           → ★ Web 登录页（左右布局：品牌区 + 表单区）
│
├── 公共/                               ← 多端共享资源
│   ├── design-system/
│   │   └── design-system.css           → 设计系统（CSS 变量 / Reset / 栅格 / 工具类）
│   ├── styles/
│   │   └── main.css                    → 全局组件样式（按钮 / 卡片 / 表格 / 分页 / 空状态...）
│   ├── lib/
│   │   ├── font-awesome/               → Font Awesome 4.7.0（本地化，离线可用）
│   │   └── echarts/                    → ECharts 5.5.0（本地化，离线可用）
│   ├── scripts/
│   │   ├── common.js                   → 公共方法库（DOM / 格式化 / UI反馈 / 存储 / iframe通信 / 分页 / 空状态 / PRD阅读器自动加载）
│   │   ├── prd-reader.js               → ★ PRD 文档阅读器组件（浮动按钮 + 侧滑面板 + Markdown渲染 + 多文档Tab）
│   │   ├── prd-map.js                  → ★ PRD 文档与 HTML 页面直接关联映射（每项 { name, file }）
│   │   ├── event-bus.js                → 跨组件事件总线
│   │   ├── state-manager.js            → 轻量状态管理
│   │   └── mock-api.js                 → Mock 数据接口（数据内嵌，兼容 file://）
│   └── data/mock/                      → JSON 数据文件（users / products / orders）
│
├── 管理端/
│   ├── index.html                      → 框架页（浅色侧边栏 + 顶栏 + iframe）
│   ├── 管理端.css                      → 管理端特有样式（框架 + 子页面共用）
│   ├── 仪表盘.html                      → 统计卡片 + ECharts 多图表 + 最近订单 + 快捷操作
│   ├── 用户管理.html                    → 搜索 + 筛选 + 分页表格（含每页条数切换）
│   ├── 商品管理.html                    → 多条件筛选 + 编辑/上下架
│   └── 订单管理.html                    → 统计 + 状态 Tab + 分页表格
│
├── 运营端/
│   ├── index.html                      → 框架页（浅色侧边栏 + 顶栏 + iframe）
│   ├── 运营端.css                      → 运营端特有样式（框架 + 子页面共用）
│   ├── 数据看板.html                    → KPI卡片 + ECharts 多图表（柱状/环形/漏斗/面积）+ 排行榜
│   ├── 活动管理.html                    → 活动卡片（AI生成封面图）
│   └── images/                         → 活动封面图（AI 生成）
│
├── 用户端/
│   ├── index.html                      → 框架页（顶部导航 + iframe）
│   ├── 用户端.css                      → 用户端特有样式（框架 + 子页面共用）
│   ├── 首页.html                        → Banner + 分类 + 商品网格
│   ├── 商品列表.html                    → 侧边筛选 + 排序 + 商品卡片
│   └── 商品详情.html                    → 大图 + 规格 + 购买按钮
│
├── 手机端/
│   ├── index.html                      → 框架页（底部Tab导航 + iframe）
│   ├── 手机端.css                      → ★ 手机端样式统一入口（@import 加载 design-system + Font Awesome）
│   ├── design-system.css               → ★ 手机端独立设计系统（iOS风格变量）
│   ├── 登录.html                        → 移动端登录（账号/验证码/第三方，登录后进入首页）
│   ├── 首页.html                        → 轮播 + 分类 + 商品流
│   ├── 分类.html                        → 分类网格 + 商品列表
│   ├── 购物车.html                      → 商品列表 + 全选 + 结算
│   └── 我的.html                        → 用户信息 + 订单 + 功能菜单
│
└── 资源/                                → 图片 / 字体
    ├── images/                          → 占位图素材
    └── fonts/                           → 字体文件（待填充）

├── prd/                                 → ★ PRD 文档目录（纯 .md 格式，通过 fetch 加载）
│   ├── user-management.md              → 用户管理 PRD
│   ├── user-create.md                  → 新增用户功能 PRD
│   ├── product-list.md                 → 商品列表 PRD
│   └── dashboard.md                    → 仪表盘 PRD
```

## 核心架构

### 1. 导航入口 + 框架 + iframe 模式

根目录 `index.html` 是导航入口页，展示5个端的卡片入口。每个端的 `index.html` 是框架页，包含导航布局和一个 `<iframe>`：

```
index.html（导航入口）
  └── 点击卡片 → 新标签打开对应端 index.html

端 index.html（框架页）
  ├── 导航栏（侧边栏 / 顶部导航 / 底部Tab）
  └── <iframe> → 加载子页面
```

点击导航项 → 切换 iframe.src → 子页面加载。子页面可通过 `Common.navigateInParent('目标页.html', '标题')` 请求父框架切换页面。

### 2. 样式分层架构

| 类型 | 存放位置 | 引用方式 | 作用域 |
|------|---------|---------|--------|
| 公共设计系统 | `公共/design-system/` | 由各端 CSS 顶部 `@import` 统一加载 | 所有端所有页面 |
| 公共组件样式 | `公共/styles/main.css` | 由各端 CSS 顶部 `@import` 统一加载 | 所有端所有页面 |
| Font Awesome | `公共/lib/font-awesome/` | 由各端 CSS 顶部 `@import` 统一加载 | 所有端所有页面 |
| ECharts | `公共/lib/echarts/` | `<script src="../公共/...">` | 需要图表的页面 |
| 端统一样式入口 | `端名/端名.css` | `<link href="端名.css">` | 该端框架页 + 所有子页面 |
| 手机端样式入口 | `手机端/手机端.css` | `<link href="手机端.css">` | 手机端所有页面（独立于公共设计系统） |
| 页面特有样式 | 子页面 HTML 的 `<style>` 内 | 内嵌 | 仅该页面 |
| 页面特有逻辑 | 子页面 HTML 的 `<script>` 内 | 内嵌 | 仅该页面 |

> **公共样式统一入口**：管理端/运营端/用户端 CSS 顶部通过 `@import` 引入公共设计系统、`main.css` 和 Font Awesome；手机端通过 `手机端.css` 引入本地 `design-system.css` 与 Font Awesome。**页面只需引入对应端的 CSS 一个文件**，无需重复写公共样式引入。
>
> **注意**：手机端使用独立的 `design-system.css`（iOS 风格变量），不引用公共设计系统；根目录 `index.html`、`登录.html` 无端 CSS，仍直接引入公共样式。

### 3. Font Awesome 图标库

已本地化到 `公共/lib/font-awesome/`，完全离线可用：

```html
<!-- 在 <head> 中引入 -->
<link rel="stylesheet" href="../公共/lib/font-awesome/css/font-awesome.min.css">
```

使用方式：

```html
<i class="fa fa-dashboard"></i>       <!-- 仪表盘图标 -->
<i class="fa fa-users"></i>           <!-- 用户图标 -->
<i class="fa fa-shopping-cart"></i>   <!-- 购物车图标 -->
<i class="fa fa-cog"></i>             <!-- 设置图标 -->
```

常用图标参考：`fa-dashboard` `fa-users` `fa-cube` `fa-file-text-o` `fa-shopping-bag` `fa-shopping-cart` `fa-search` `fa-bars` `fa-line-chart` `fa-bar-chart` `fa-bullseye` `fa-cog` `fa-bell` `fa-envelope` `fa-heart` `fa-star` `fa-trash` `fa-edit` `fa-plus` `fa-download` `fa-upload` `fa-sign-in` `fa-mobile` `fa-user-o` `fa-lock` `fa-wechat` `fa-qq` `fa-apple` `fa-weibo`

### 4. ECharts 图表库

已本地化到 `公共/lib/echarts/`，完全离线可用：

```html
<!-- 在 </body> 前引入 -->
<script src="../公共/lib/echarts/echarts.min.js"></script>
```

使用方式：

```js
var chart = echarts.init(document.getElementById('chartDom'));
chart.setOption({
  color: ['#2563EB', '#10B981', '#F59E0B', '#8B5CF6'],  // 统一配色
  // ... 图表配置
});
window.addEventListener('resize', function() { chart.resize(); });
```

支持图表类型：折线图(line)、柱状图(bar)、饼图/环形图(pie)、玫瑰图(rose)、漏斗图(funnel)、面积图(area)。

### 5. common.js 公共方法

所有端页面可通过 `window.Common` 调用，引入方式：`<script src="../公共/scripts/common.js"></script>`。

#### DOM 快捷方法

| 方法 | 说明 |
|------|------|
| `Common.$(selector, parent?)` | querySelector |
| `Common.$$(selector, parent?)` | querySelectorAll → 数组 |
| `Common.createEl(tag, attrs?, children?)` | 创建元素（支持 class/text/html/style/data-* 属性） |
| `Common.on(el, event, selector, handler)` | 事件委托（基于 `closest` 匹配） |

#### 格式化

| 方法 | 说明 |
|------|------|
| `Common.formatMoney(num, prefix?)` | 格式化金额 → ¥1,234.56 |
| `Common.formatNumber(num)` | 格式化数字（千分位） → 1,234 |
| `Common.formatDate(date, withTime?)` | 格式化日期 → 2026-01-15 / 2026-01-15 14:30 |
| `Common.formatRelativeTime(date)` | 相对时间 → 刚刚 / 3分钟前 / 2小时前 / 5天前 |

#### UI 反馈

| 方法 | 说明 |
|------|------|
| `Common.toast(msg, type?, duration?)` | 轻提示（info/success/warning/danger，默认 2500ms 自动消失，0=不消失） |
| `Common.dismissToast(toast)` | 手动关闭指定 Toast |
| `Common.confirm(opts, onConfirm?, onCancel?)` | 确认对话框，支持字符串或配置对象，返回 `Promise<boolean>` |
| `Common.showLoading(message?)` | 显示加载遮罩 |
| `Common.hideLoading()` | 隐藏加载遮罩 |

**confirm 两种调用方式：**

```js
// 旧方式（向后兼容）
Common.confirm('确定删除？', function() { /* 确认 */ }, function() { /* 取消 */ });

// 新方式（推荐，返回 Promise）
Common.confirm({
  title: '删除确认',
  message: '确定要删除该用户吗？',
  type: 'danger',           // danger | warning | info
  confirmText: '删除',
  cancelText: '取消'
}).then(function(ok) {
  if (ok) { /* 确认 */ }
});
```

#### 本地存储

| 方法 | 说明 |
|------|------|
| `Common.storage.get(key, defaultVal?)` | 读取（自动 JSON 解析） |
| `Common.storage.set(key, value)` | 写入（自动 JSON 序列化） |
| `Common.storage.remove(key)` | 删除 |

#### 工具函数

| 方法 | 说明 |
|------|------|
| `Common.debounce(fn, delay?)` | 防抖（默认 300ms） |
| `Common.throttle(fn, delay?)` | 节流（默认 200ms） |
| `Common.deepClone(obj)` | 深拷贝（JSON 序列化） |
| `Common.uuid()` | 生成唯一 ID |
| `Common.getQueryParam(name)` | 获取单个 URL 查询参数 |
| `Common.getAllQueryParams()` | 获取所有 URL 查询参数 → `{ key: value }` |

#### iframe 通信

| 方法 | 说明 |
|------|------|
| `Common.navigateInParent(pageUrl, title?)` | 子页面 → 父框架：请求切换 iframe 页面 |
| `Common.onChildNavigate(callback)` | 父框架：监听子页面导航请求 |
| `Common.setParentTitle(title)` | 子页面 → 父框架：更新框架页标题 |

#### 通用渲染辅助

| 方法 | 说明 |
|------|------|
| `Common.renderEmpty(container, text?)` | 渲染空状态（自动适配 tbody / div 容器） |
| `Common.renderPagination(container, currentPage, totalPages, total, onPageChange, options?)` | 渲染分页（支持每页条数切换 + 跳页） |
| `Common.renderSkeleton(container, rows?)` | 渲染骨架屏 |

**renderPagination 参数说明：**

```js
Common.renderPagination(container, currentPage, totalPages, total, onPageChange, {
  pageSize: 10,              // 当前每页条数
  pageSizeOptions: [10, 20, 50, 100],  // 可选条数
  onPageSizeChange: function(size) { ... },  // 切换条数回调
  showJumper: true           // 是否显示跳页输入框
});
```

**renderEmpty 容器适配：**

```js
// div 容器 → 直接插入空状态
Common.renderEmpty(document.getElementById('list'));

// tbody 容器 → 自动包裹 <tr><td colspan="N">，保持合法表格结构
Common.renderEmpty(document.querySelector('#table tbody'));
```

#### 字符计数器

为输入框/文本域在内部右侧绑定实时字符计数器，显示格式 `当前/上限`，满字时自动标红。

| 方法 | 说明 |
|------|------|
| `Common.bindCharCounter(input, options?)` | 单个绑定，返回包裹容器 `.char-counter-wrap` |
| `Common.bindCharCounters(selector?, options?)` | 批量绑定，返回成功绑定数量 |

```html
<!-- HTML：加 data-char-counter + maxlength 即可 -->
<input type="text" data-char-counter maxlength="20">
<textarea data-char-counter maxlength="200"></textarea>
```

```js
// 批量绑定（页面加载后调用一次，自动扫描所有 data-char-counter）
Common.bindCharCounters();

// 单个绑定 + 自定义选项
Common.bindCharCounter('#username', { maxLength: 20, hideWhenEmpty: true });
```

| 选项 | 类型 | 说明 |
|------|------|------|
| `maxLength` | number | 上限，缺省时读取 input 的 `maxlength` 属性 |
| `hideWhenEmpty` | boolean | 输入为空时隐藏计数器，默认 false |

### 6. MockAPI 数据接口

数据内嵌在 `mock-api.js` 中（兼容 `file://` 协议），模拟网络延迟和分页：

```js
MockAPI.getUsers({ page: 1, pageSize: 10, keyword: '张' }).then(function(res) {
  // res.list / res.total / res.totalPages
});
MockAPI.getProducts({ category: '智能穿戴' }).then(...);
MockAPI.getOrders({ status: 'pending' }).then(...);
MockAPI.getStats().then(...);
MockAPI.raw.users  // 原始全量数据
```

### 7. PRD 文档阅读器

非侵入式组件：每个页面只需引入 `common.js`（页面已引入），PRD 阅读器会**自动加载**，无需修改任何 HTML 页面。当当前页面在关联映射中有对应的 PRD 文档时，右下角自动出现浮动按钮。

#### 工作原理

```
页面引入 common.js
  └── common.js 末尾用 document.write 自动注入 prd-map.js + prd-reader.js
       ├── prd-map.js   → PRD_MAP（页面→文档直接关联，每项 { name, file }）
       └── prd-reader.js → 匹配页面路径 → 显示浮动按钮 → 点击打开侧滑面板 → fetch 加载 .md → Markdown 渲染
```

#### 文件结构

| 文件 | 说明 |
|------|------|
| `公共/scripts/prd-map.js` | PRD_MAP（页面→文档关联映射，每项含 `name` 显示名称 + `file` 文件路径） |
| `公共/scripts/prd-reader.js` | 阅读器组件（浮动按钮 + 侧滑面板 + Markdown 渲染 + Tab 切换，CSS 自注入） |
| `prd/*.md` | PRD 文档内容（纯 Markdown 格式） |

> **协议兼容**：
> - **http:// 协议**（推荐）：`fetch()` 正常加载 `.md` 文件内容
> - **file:// 协议**：`fetch` 被浏览器安全策略阻止，面板中会提示用户使用本地服务器打开。建议开发时用 `python -m http.server` 或 `npx serve .` 启动本地服务器

#### 功能特性

- 右下角浮动按钮（带文档数量角标）
- 点击打开右侧滑面板
- 多文档 Tab 切换（一个页面可关联多个 PRD）
- Markdown 渲染：标题、列表、表格、代码块、引用、行内代码、链接、加粗、斜体
- 可拖拽调整面板宽度
- 目录导航（TOC）+ 滚动联动高亮
- 预览 / Markdown 源码双视图切换
- 插件 CSS 自注入（不依赖 main.css）
- 遮罩点击关闭、ESC 关闭
- 文档内容首次加载后缓存

#### 如何为页面关联 PRD 文档

**1. 创建 PRD 文档**（`prd/xxx.md`，纯 Markdown 格式）：

```markdown
# 功能 PRD

## 1. 概述
功能描述...
```

**2. 在 `prd-map.js` 中为页面添加关联**：

```js
// PRD_MAP 直接关联页面与文档（每项 { name, file }）
PRD_MAP['管理端/某页面.html'] = [
  { name: '我的功能 PRD', file: 'prd/my-feature.md' }
];

// 一个页面可关联多个文档，同一文档可被多个页面关联（多对多）
PRD_MAP['管理端/另一页面.html'] = [
  { name: '我的功能 PRD', file: 'prd/my-feature.md' },
  { name: '用户管理 PRD', file: 'prd/user-management.md' }
];
```

> **关联规则**：`PRD_MAP` 的 key 是页面相对根目录的路径（如 `管理端/用户管理.html`），也支持按文件名模糊匹配。`name` 用于 Tab 栏和预览时显示，`file` 指向 `.md` 文件路径。一个页面可关联多个文档，同一文档可被多个页面关联。

## 设计规范

### 配色体系

| 用途 | CSS 变量 | 色值 |
|------|---------|------|
| 主色 | `--color-primary` | `#2563EB` |
| 主色深 | `--color-primary-dark` | `#1D4ED8` |
| 主色浅 | `--color-primary-light` | `#DBEAFE` |
| 成功 | `--color-success` | `#10B981` |
| 警告 | `--color-warning` | `#F59E0B` |
| 危险 | `--color-danger` | `#EF4444` |
| 边框浅 | `--color-border-light` | `#F3F4F6` |
| 页面背景 | `--color-bg-page` | `#F8F9FB` |



## 如何新增页面

1. 在对应端文件夹新建 `新页面.html`
2. 复制以下 `<head>` 引用（以管理端为例）——**只需引入对应端的 CSS 一个文件**，公共样式已由该文件顶部 `@import` 统一加载：
   ```html
   <link rel="stylesheet" href="管理端.css">
   <script src="../公共/scripts/common.js"></script>
   <script src="../公共/scripts/mock-api.js"></script>
   ```
3. 如需图表，在 `</body>` 前引入 ECharts：
   ```html
   <script src="../公共/lib/echarts/echarts.min.js"></script>
   ```
4. 写 HTML 结构，使用 `<i class="fa fa-xxx">` 添加图标
5. 在 `<style>` 写页面专属样式
6. 在 `<script>` 写页面逻辑
7. 在该端 `index.html` 的导航中添加对应菜单项

> **手机端页面**引用方式略有不同，使用独立设计系统（已由 `手机端.css` 统一加载）：
> ```html
> <link rel="stylesheet" href="手机端.css">
> ```

## 如何新增端

1. 新建端文件夹（如 `客服端/`）
2. 创建 `index.html` 框架页（可参考现有端复制修改）
3. 创建 `客服端.css` 端特有样式文件，**文件顶部用 `@import` 引入公共样式**：
   ```css
   @import url('../公共/design-system/design-system.css');
   @import url('../公共/styles/main.css');
   @import url('../公共/lib/font-awesome/css/font-awesome.min.css');
   ```
4. 创建该端的子页面（页面只引入 `客服端.css` 即可）
5. 在根目录 `index.html` 的 `.module-grid` 中添加入口卡片
