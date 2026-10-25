# 技术架构

## 1. 技术栈

- Next.js 16（App Router，静态生成优先）
- React 19 + TypeScript strict mode
- Tailwind CSS v4（CSS-first 配置，设计令牌见 `src/app/globals.css`）
- Radix UI 原语 + 自建 `src/components/ui/` 组件（shadcn/ui 风格）
- Lucide React 图标
- MDX 内容：`content/**/*.mdx` + frontmatter，运行时经 `next-mdx-remote` 编译
- Zod 4：内容 frontmatter 校验
- Vitest：单元测试（Node 环境，测试 `src/lib` 纯函数）
- Playwright：端到端测试
- ESLint + Prettier（`prettier-plugin-tailwindcss`）

## 2. 目录结构

```
content/
  knowledge/   科普文章 .mdx（frontmatter + 正文）
  courses/     干预课程 .mdx
  resources/   资源说明 .mdx（下载文件本体在 public/downloads/）
  safety/      安全指南 .mdx
src/
  app/         路由页面（App Router）
  components/  UI 组件（ui/ 为基础组件，其余为业务组件）
  lib/         内容读取、校验、搜索、观察结果生成等纯逻辑
  schemas/     Zod schema 与类型
  data/        结构化站点数据（导航、分类、观察题库）
public/
  downloads/   可下载/打印的资源文件
tests/
  unit/        Vitest
  e2e/         Playwright
docs/          产品与内容规范文档
```

## 3. 内容管理与数据流

1. 作者在 `content/<type>/` 新建 `.mdx` 文件，frontmatter 按 `src/schemas/content.ts` 的 Zod schema 编写。
2. 构建期 `src/lib/content.ts` 读取目录、解析 frontmatter、Zod 校验；`reviewStatus !== "published"` 的内容不进入公开列表，校验失败导致构建失败（`CONTENT_STRICT=0` 可降级为告警，仅用于本地草稿预览）。
3. 文章正文经 `next-mdx-remote` 编译渲染；标题层级自动提取生成目录。
4. 搜索 `/search` 在构建期将公开内容的可检索字段汇总为索引，客户端按标题/摘要/标签/正文片段匹配，支持分类、年龄组、受众筛选。
5. 资源下载：`content/resources/*.mdx` 描述元信息与使用说明，`public/downloads/` 存放真实文件，页面经 `/downloads/<file>` 直接链接。打印模板为独立路由 `/resources/[slug]/print`，浏览器打印即可保存为 PDF。

## 4. 发展能力观察

- 题库为结构化数据 `src/data/observation-domains.ts`（领域 → 条目 → 选项）。
- 交互组件为客户端组件；默认不持久化。用户勾选"保存在此浏览器"后才写 `localStorage`，随时可清除。
- 结果生成逻辑在 `src/lib/observation.ts`，为纯函数，便于单测：输出各领域"已观察到的能力 / 尚不明确 / 可进一步记录的场景"及家庭支持建议。不生成诊断或风险分数。

## 5. 扩展方案

- 数据库：后续引入 Supabase/托管 PostgreSQL 时，内容可迁移至 `courses`、`resources`、`directory_entries` 等表；`users`、`bookmarks`、`observations`、`community_posts` 预留于数据模型设计（见 docs/PRD.md）。RLS、服务端鉴权为接入前置条件。
- 机构名录：需要信息核实流程（来源、核实状态、更新时间、纠错/撤下申请）后再上线真实数据。
- 社区：上线前需完成认证、内容审核、举报、儿童信息保护、医疗建议边界、数据保留策略。
- 标准化量表：仅在授权、适用年龄与使用规则核实后接入。

## 6. 假设记录

- 暂无真实专业审核人员：内容 `reviewStatus` 使用 `published` 表示"编辑整理已发布"，`reviewerRole` 显示为"编辑整理，待专业审核"，不标注"医生/专家审核"。
- 参考来源只使用真实存在的公开文献与机构页面。
- 第一版无后端，所有内容构建期静态生成。
