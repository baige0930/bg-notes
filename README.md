# bg-notes

基于 Jekyll + Cayman 主题的个人笔记站点，在 Cayman 原有样式基础上增加了双侧边栏、折叠导航、目录等功能。

---

## 与原版 Cayman 的主要改动

- **双侧边栏**：左侧为笔记导航栏，右侧为当前页面目录（TOC），均使用 `position: sticky` 跟随页面滚动，无 JS 延迟
- **导航节点可折叠**：每个文件夹节点左侧有箭头按钮，点击可折叠/展开，状态持久化到 `localStorage`
- **右侧 TOC**：自动从页面 `h2`/`h3` 标题生成，滚动时高亮当前节点
- **侧边栏宽度可拖拽调整**：拖动边缘 handle 改变宽度，宽度保存到 `localStorage`
- **Header 右上角图标**：Home 按钮 + GitHub 仓库链接（SVG 图标，替代原版文字按钮）
- **Cayman 原有样式完整保留**：字体、配色、渐变头、正文排版均未覆盖

自定义样式文件：`assets/css/sidebar.css`  
自定义脚本文件：`assets/js/sidebar.js`

---

## Layout 说明

### `layout: home`

用于站点首页（`index.md`），显示所有笔记的汇总列表，按日期倒序，支持分页。

```yaml
---
layout: home
title: "首页标题"
---
```

---

### `layout: index`

用于每个文件夹的 `index.md`，显示该文件夹下的文章列表。  
`index.md` 的正文内容会渲染在列表上方。

**Front matter 字段：**

| 字段 | 类型 | 说明 |
|---|---|---|
| `title` | string | 文件夹标题，显示在列表标题和侧边栏导航中 |
| `expand` | string | 控制该节点在侧边栏的默认展开状态（见下） |

**`expand` 可选值：**

| 值 | 效果 |
|---|---|
| `all`（默认，不填即为此值） | 侧边栏默认展开显示所有子页面 |
| `none` | 侧边栏默认折叠，用户可手动点击展开 |

```yaml
---
layout: index
title: "C++ 笔记"
expand: none
---

这里是可选的文件夹简介，会渲染在文章列表上方。
```

---

### `layout: page`

用于普通笔记文章，渲染正文内容，顶部自动显示标题和日期。  
右侧 TOC 会自动从 `h2`/`h3` 标题生成。

```yaml
---
layout: page
title: "文章标题"
date: 2026-03-09
---

## 小节标题

正文内容……
```
