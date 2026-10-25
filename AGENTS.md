<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## 项目说明

星伴成长（Spectrum Guide）：中文自闭症循证知识与实操平台。Next.js 16 + Tailwind 4 + MDX 静态内容站。

### 常用命令

- `npm run dev` / `npm run build` / `npm run start`
- `npm run lint`（ESLint）、`npm run typecheck`（tsc --noEmit，先 `npx next typegen`）
- `npm run test`（Vitest，32 个单元测试）、`npm run test:e2e`（Playwright，15 个 e2e）
- `npm run format`（Prettier）

### 关键约定

- 内容在 `content/{knowledge,courses,resources,safety}/*.mdx`，frontmatter 由 `src/schemas/content.ts` 的 Zod schema 校验；`reviewStatus: published` 才对外可见。
- 内容读取/搜索/观察逻辑集中在 `src/lib/`，页面组件不写业务逻辑。
- YAML frontmatter 中字符串含引号或冒号时用单引号包裹整行；未加引号的日期会被解析为 Date（schema 已做预处理）。
- 观察工具仅浏览器本地处理，不向服务端提交，不产出诊断/评分。
- 文档：docs/PRD.md、ARCHITECTURE.md、CONTENT_GUIDELINES.md、PRIVACY.md。
