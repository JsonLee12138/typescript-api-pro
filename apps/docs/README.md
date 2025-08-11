# TypeScript API Pro 文档

这是 TypeScript API Pro 的官方文档网站，使用 [Docusaurus](https://docusaurus.io/) 构建。

## 项目结构

```
apps/docs/
├── docs/                    # 文档内容
│   ├── intro.md            # 项目介绍
│   ├── getting-started.md  # 快速上手指南
│   └── api/                # API 参考文档
│       ├── overview.md     # API 概览
│       ├── object-types.md # 对象类型工具
│       ├── array-types.md  # 数组类型工具
│       ├── map-types.md    # Map 类型工具
│       └── set-types.md    # Set 类型工具
├── blog/                   # 博客文章
├── src/                    # 网站源码
│   ├── components/         # React 组件
│   ├── css/               # 样式文件
│   └── pages/             # 页面文件
├── static/                # 静态资源
├── docusaurus.config.ts   # Docusaurus 配置
└── sidebars.ts            # 侧边栏配置
```

## 本地开发

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm start
```

这将启动本地开发服务器并打开浏览器。大多数更改会实时反映，无需重启服务器。

### 构建

```bash
npm run build
```

这个命令会生成静态内容到 `build` 目录，可以用于部署到任何静态文件托管服务。

### 部署

使用 SSH：

```bash
USE_SSH=true npm run deploy
```

不使用 SSH：

```bash
GIT_USER=<Your GitHub username> npm run deploy
```

如果你使用 GitHub Pages 进行托管，这个命令是一个方便的方式来构建网站并推送到 `gh-pages` 分支。

## 文档编写指南

### 添加新文档

1. 在 `docs/` 目录下创建新的 Markdown 文件
2. 在文件顶部添加 frontmatter：

```markdown
---
sidebar_position: 1
title: 文档标题
---

# 文档内容
```

3. 在 `sidebars.ts` 中添加文档路径

### 添加新博客文章

1. 在 `blog/` 目录下创建新的 Markdown 文件
2. 文件名格式：`YYYY-MM-DD-title.md`
3. 在文件顶部添加 frontmatter：

```markdown
---
slug: article-slug
title: 文章标题
authors: [author-key]
tags: [tag1, tag2]
---

文章内容...
```

### 代码示例

在文档中添加 TypeScript 代码示例时，请使用语法高亮：

````markdown
```typescript
import type { AnyObject } from 'typescript-api-pro';

type Config = AnyObject<string>;
```
````

### 最佳实践

1. **保持文档更新**：当 API 发生变化时，及时更新相关文档
2. **提供完整示例**：每个类型工具都应该有完整的使用示例
3. **添加实际应用场景**：展示类型工具在真实项目中的使用方法
4. **保持一致性**：使用统一的文档格式和代码风格

## 贡献指南

欢迎为文档做出贡献！请遵循以下步骤：

1. Fork 项目
2. 创建功能分支：`git checkout -b feature/improve-docs`
3. 提交更改：`git commit -am 'Improve documentation'`
4. 推送到分支：`git push origin feature/improve-docs`
5. 创建 Pull Request

## 技术栈

- **Docusaurus 3**: 静态网站生成器
- **React**: UI 框架
- **TypeScript**: 类型安全
- **Markdown**: 文档格式
- **Prism**: 代码语法高亮

## 部署

文档网站自动部署到 GitHub Pages，访问地址：
https://jsonlee12138.github.io/typescript-api-pro/

每次推送到 main 分支时，GitHub Actions 会自动构建和部署网站。
