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
│   │   ├── common.js                   → 公共方法库（DOM / 格式化 / UI反馈 / 存储 / iframe通信 / 分页 / 空状态）
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

| 方法 | 说明 |
|------|------|
| `Common.$()` / `Common.$$()` | DOM 查询 |
| `Common.createEl()` | 创建元素 |
| `Common.formatMoney()` | 格式化金额 → ¥1,234.56 |
| `Common.formatDate()` | 格式化日期 |
| `Common.formatRelativeTime()` | 相对时间 → 3小时前 |
| `Common.formatNumber()` | 格式化数字（千分位） |
| `Common.toast(msg, type)` | 轻提示 |
| `Common.confirm(msg, onOk)` | 确认对话框 |
| `Common.showLoading()` / `hideLoading()` | 加载遮罩 |
| `Common.storage.get/set/remove` | localStorage 封装 |
| `Common.debounce()` / `throttle()` | 防抖 / 节流 |
| `Common.deepClone()` | 深拷贝 |
| `Common.navigateInParent(page, title)` | 子页面 → 父框架导航 |
| `Common.onChildNavigate(cb)` | 父框架监听子页面导航 |
| `Common.renderEmpty(el, text)` | 渲染空状态（自动适配 tbody / div 容器） |
| `Common.renderPagination(el, curPage, totalPages, total, onPageChange, options)` | 渲染分页（支持每页条数切换 + 跳页） |
| `Common.renderSkeleton(el, rows)` | 渲染骨架屏 |

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

### 字体

全项目统一字体栈（不使用特殊字体定义）：

```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Microsoft YaHei", sans-serif;
```

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
