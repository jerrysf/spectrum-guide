# 星伴成长（Spectrum Guide）

面向中国大陆自闭症儿童家长、特殊教育教师和康复师的**循证知识与实操平台**。

核心理念：循证为主、尊重个体差异、语言通俗可操作、不宣称治愈、优先保护儿童隐私。

## 功能概览

| 模块 | 路由 | 说明 |
| ---- | ---- | ---- |
| 首页 | `/` | 搜索、分类入口、热门内容、循证原则、安全指南入口 |
| 科普知识 | `/knowledge`、`/knowledge/[slug]` | 12 篇 MDX 文章，含审核状态与真实参考来源 |
| 评估工具 | `/assessment`、`/assessment/development` | 非诊断性发展能力观察，本地处理、可打印摘要 |
| 干预课程 | `/courses`、`/courses/[slug]` | 8 门结构化实操课程 |
| 资源下载 | `/resources`、`/resources/[slug]`、`…/print` | 8 个可打印自制模板（浏览器另存为 PDF） |
| 安全指南 | `/safety`、`/safety/[slug]` | 自伤、走失、情绪危机 3 篇 |
| 全站搜索 | `/search` | 本地索引搜索，支持分类/受众/年龄筛选与分页 |
| 专区 | `/parent-guide`、`/professional` | 家长与专业人员内容入口 |
| 机构名录与社区 | `/directory` | 筹备中状态说明（无虚构数据） |
| 关于 | `/about/*` | 平台介绍、循证标准、隐私政策、免责声明 |
| 管理预留 | `/admin` | 预留入口，无管理能力 |

## 技术栈

Next.js 16（App Router）· React 19 · TypeScript strict · Tailwind CSS 4 · Radix UI · Lucide · MDX（next-mdx-remote）· Zod 4 · Vitest · Playwright

## 本地运行

```bash
npm install        # 安装依赖
npm run dev        # 开发服务器 http://localhost:3000
```

## 常用命令

```bash
npm run build          # 生产构建（全部页面静态生成）
npm run start          # 启动生产服务器
npm run lint           # ESLint
npm run typecheck      # TypeScript 类型检查（先跑 next typegen 生成路由类型）
npm run format         # Prettier 格式化
npm run test           # Vitest 单元测试（32 个）
npm run test:e2e       # Playwright 端到端测试（15 个，自动构建并起服务）
```

Playwright 首次运行需要 `npx playwright install chromium`。

## 内容管理

内容为 `content/` 下的 MDX 文件，frontmatter 按 `src/schemas/content.ts` 的 Zod schema 编写：

```
content/
  knowledge/   科普文章
  courses/     干预课程
  resources/   资源（打印模板数据在 frontmatter 的 templateData）
  safety/      安全指南
```

- `reviewStatus` 为 `draft` / `needs_review` / `reviewed` / `published`，只有 `published` 对外可见。
- 构建时校验全部 frontmatter，校验失败导致构建失败（`CONTENT_STRICT=0` 可降级为警告，用于本地草稿）。
- 新增内容后建议跑 `npm run test` 校验 slug 唯一性与 related 链接有效性。

资源打印模板在 `src/components/print-templates/`，新增模板需在 `src/lib/print-templates.ts` 注册。

## 环境变量

见 `.env.example`。当前版本为纯静态站点，不需要任何密钥。`NEXT_PUBLIC_SITE_URL` 用于 sitemap/canonical，生产部署时设置为真实域名。

## 部署

全站静态生成，适合部署到 Vercel、Netlify 或任意静态托管：

```bash
npm run build && npm run start
```

或 `next build && next export` 类流程（本项目使用默认输出，无服务端依赖，除 `/search`、列表页筛选等按需渲染路由外均为预渲染静态页）。

## 设计假设与已知限制

- **暂无专业审核人员**：所有内容标注为"编辑整理，待专业审核"，不声称"医生/专家审核"。医学内容附有真实参考来源，但上线前应由具备资质的专业人员复核（见 docs/CONTENT_GUIDELINES.md）。
- **无标准化量表**：M-CHAT、ABC、CARS 等量表涉及授权与使用规范，本站只作介绍不提供在线计分；发展能力观察工具不产出诊断或风险评分。
- **机构名录/社区为筹备中页面**：无虚构机构与用户数据。
- **无账号系统**：观察数据仅存于用户浏览器 localStorage（需用户勾选）。
- **联系方式为占位符**（hello@example.com），上线前需替换。
- **待确认事项**（需法律/专业确认）：隐私政策法律复核、内容专业复核、ICP 备案等合规要求——见 docs/PRIVACY.md 的上线检查清单。

## 文档

- `docs/PRD.md` — 产品需求与验收标准
- `docs/ARCHITECTURE.md` — 技术架构与扩展方案
- `docs/CONTENT_GUIDELINES.md` — 内容规范与循证标准
- `docs/PRIVACY.md` — 隐私与数据保护规范

## 后续规划

1. 观察历史与账号系统（需认证、RLS、数据加密与删除机制）
2. 机构名录（需信息核实与撤下流程）
3. 问答社区（需审核、举报、儿童信息保护机制）
