# bg-notes

基于 **Jekyll + Cayman** 的个人笔记站点。

- 不改 Cayman 的整体视觉风格（渐变头、排版、字体等），只在其基础上补齐「更适合笔记站」的导航、目录、搜索与列表体验。
- 页面可以直接部署到 **GitHub Pages**。

> 如果不需要本地预览：直接把代码推送到 GitHub（GitHub Pages）即可生成站点，无需安装任何本地插件或额外依赖。

---

## 在 Cayman 基础上的主要增强

- **三栏布局**：左侧“笔记导航栏” + 中间正文 + 右侧“本页目录（TOC）”。两侧栏使用 `position: sticky`，滚动同步无延迟。
- **左侧导航（支持折叠）**：自动扫描 `/note/**/index.md` 作为分组，组内列出文章；支持折叠/展开，状态保存到 `localStorage`。移动端（≤960px）变为抽屉模式，点击按钮滑入/滑出。
- **右侧 TOC（桌面端）**：自动从正文 `h2/h3` 生成，本页滚动时高亮当前位置；移动端默认隐藏。
- **拖拽调整宽度**：左右侧栏都可以拖拽调整宽度，宽度持久化到 `localStorage`；拖拽时禁用动画以保证跟手。
- **搜索**：侧边栏内置搜索框，基于 `search.json` 在前端检索；结果 snippet 中关键词高亮（`<mark>`），点击 snippet 跳转到目标页对应位置。
- **列表页分页**：首页与文件夹列表页支持前端分页。
- **数学公式**：默认引入 KaTeX，支持 `$...$` / `$$...$$` 自动渲染。
- **Header 角落按钮**：右上角 Home + GitHub 图标按钮；Header 宽度始终锁定为 `100vw`，不随侧边栏宽度变化。
- **回到顶部按钮**：右下角固定按钮，滚动过 Header 后出现，点击平滑回到顶部。

自定义文件：
- 样式：`assets/css/sidebar.css`
- 脚本：`assets/js/sidebar.js`
- 布局：`_layouts/*.html`
- 侧边栏结构：`_includes/sidebar.html`

---

## 内容组织约定

- 所有笔记建议放在 `note/` 下。
- 每个子目录用一个 `index.md` 作为“文件夹入口页”（同时也是左侧导航的一个分组）。
- 普通文章是该目录下除 `index.md` 之外的 `.md`。

示例：

```
note/
  diary/
    index.md           # 文件夹入口页（列表页）
    2026-03-09.md      # 普通文章
  cpp/
    index.md
    cpp-learning.md
```

---

## 各类 Markdown 如何写（layouts）

### 1) 首页：`index.md`（站点根目录）

使用 `layout: home`，会列出站点内所有文章（`/note/` 下非 `index.md` 的页面），自带分页。

```yaml
---
layout: home
title: "bg-notes"
---

这里可以写一段站点介绍（可选）。
```

---

### 2) 文件夹入口页：`note/**/index.md`

使用 `layout: index`。

- 页面正文（`content`）会显示在列表上方（可用于写该目录的简介/说明）。
- 该页面也会成为左侧导航的一个“分组”。

```yaml
---
layout: index
title: "C++ 笔记"
expand: none   # 可选：all(默认) / none
---

这里是该分类的简介（可选）。
```

`expand` 说明：
- `all`（默认）：该分组默认展开
- `none`：该分组默认折叠（用户可手动展开；状态会记到 localStorage）

---

### 3) 普通文章页：`note/**/xxx.md`

使用 `layout: page`。

```yaml
---
layout: page
title: "文章标题"
date: 2026-03-09   # 可选，但建议写，列表页会展示
---

## 二级标题（会进入右侧 TOC）

正文内容……

### 三级标题（也会进入右侧 TOC）

更多内容……
```

---

## 本地预览（可选）

想本地预览时，用 Jekyll 启动即可（例如 `bundle exec jekyll serve`）。
