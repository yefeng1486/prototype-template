/**
 * ========================================
 * prd-map.js — PRD 文档与 HTML 页面关联映射
 * ========================================
 * HTML 页面直接关联 .md 文档地址，无需中间注册表。
 * 多对多关系：每个 HTML 可关联多个 .md 文档，同一 .md 文档可被多个 HTML 关联。
 *
 * 数据结构：
 *   PRD_MAP — 以页面路径为 key，值为该页面关联的文档数组
 *   每个文档对象包含：
 *     name  — 文档名称（Tab 栏标题 + 预览时显示），可选
 *     file  — .md 文件路径（相对于项目根目录，如 'prd/user-management.md'）
 *
 * name 属性说明：
 *   - name 可省略：当 name 为空、空白或不定义时，阅读器自动从 file 路径解析文件名
 *     如 file: 'prd/user-management.md' → 自动显示 'user-management'
 *     如 file: 'README.md' → 自动显示 'README'
 *   - name 有值时优先使用 name
 *
 * 文档加载机制：
 *   prd-reader.js 通过 fetch() 加载 .md 文件内容（http:// 协议下可用）。
 *   file:// 协议下 fetch 被阻止时，会提示用户使用本地服务器。
 *
 * 维护方式：
 *   1. 新增 PRD 文档 → 创建 prd/文档名.md（纯 Markdown 内容）
 *   2. 在 PRD_MAP 中为页面添加关联：
 *      '端名/页面.html' → [{ name: '文档名称', file: 'prd/文档名.md' }]
 *      name 也可省略：   [{ file: 'prd/文档名.md' }]
 *   3. 同一文档被多个页面关联时，在各自页面数组中填写相同的 file 路径即可
 * ========================================
 */

/**
 * 页面 → PRD 文档关联映射
 * key:   页面相对路径（相对于项目根目录），如 '管理端/用户管理.html'
 * value: 关联的文档数组，每项 { name?, file }
 *        name — 文档名称（可选，省略时自动从 file 解析文件名）
 *        file — .md 文件路径（相对于项目根目录）
 */
var PRD_MAP = {
  '管理端/用户管理.html': [
    { name: '用户管理 PRD', file: 'prd/user-management.md' },
    { name: '新增用户功能 PRD', file: 'prd/user-create.md' }
  ],
  '管理端/仪表盘.html': [
    { name: '仪表盘 PRD', file: 'prd/dashboard.md' },
    { file: 'README.md' },
    { name: '用户管理 PRD', file: 'prd/user-management.md' }
  ],
  '用户端/商品列表.html': [
    { name: '商品列表 PRD', file: 'prd/product-list.md' }
  ],
  '手机端/首页.html': [
    { name: '首页PRD', file: 'prd/product-list.md' }
  ],
};
