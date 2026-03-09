# bg-notes

这是我的在线笔记仓库（GitHub Pages + Jekyll）。

- **用途**：记录生活日记、技术笔记、杂记（Markdown）
- **站点入口**：GitHub Pages（仓库 `Settings -> Pages` 可查看发布地址）

## 目录结构（建议长期保持）

```
bg-notes/
├── README.md
├── _config.yml
├── index.md
└── 笔记/
    ├── index.md
    └── .gitkeep
```

## 我该怎么写一篇新文章？

### 方式 A（推荐）：直接在分类目录里新建 `.md`

1. 选择目录：
   - 生活日记：`生活日记/2026/`
   - 技术笔记：`技术笔记/`
   - 杂记：`杂记/`
2. 新建一个 Markdown 文件，例如：
   - `生活日记/2026/03-09-周一.md`
   - `技术笔记/ros2-parameter.md`
   - `杂记/读书-xxx.md`
3. 在文件顶部加上 **Jekyll Front Matter**（必须有这段，Jekyll 才会按页面渲染）：

```markdown
---
layout: default
title: "标题写这里"
date: 2026-03-09
---

## 小标题

正文从这里开始……
```

### 方式 B：写成“博客文章”（可选）

如果你更喜欢“按时间线发布”，可以使用 Jekyll posts 机制：

1. 新建目录：`_posts/`
2. 文件命名必须是：`YYYY-MM-DD-xxx.md`
3. 文件头示例：

```markdown
---
layout: post
title: "今天学到的东西"
date: 2026-03-09
---
```

> 目前本仓库默认以“分类目录 + 入口页”为主；你后续要切换为 posts 我也可以帮你调整首页与列表页。

## 发布/更新流程（每次写完都这样）

1. 本地写 Markdown
2. `git add .`
3. `git commit -m "notes: add xxx"`
4. `git push`
5. 等待 GitHub Pages 自动构建（通常 1-3 分钟内生效）

## 常用写作建议（保持简单且可维护）

- **图片**：放到 `assets/images/`，文章里用相对路径引用，例如：`![alt](/assets/images/xxx.png)`
- **链接**：优先用相对路径，例如：`[某篇笔记](/技术笔记/ros2-parameter.html)`  
  - Jekyll 会把 `.md` 渲染成 `.html`，因此链接建议指向 `.html`
- **文内目录（TOC）**：先用规范的 `## / ###` 标题层级；后续如果你希望自动 TOC/侧边栏，我可以在最小改动下加一个轻量实现