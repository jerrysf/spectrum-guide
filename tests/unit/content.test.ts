import { describe, expect, it } from "vitest";
import { articleSchema, resourceSchema } from "@/schemas/content";
import {
  getArticles,
  getCourses,
  getResources,
  getSafetyGuides,
  validateContentGraph,
  validateResourceTemplates,
} from "@/lib/content";
import { extractToc } from "@/lib/mdx";

describe("内容 schema 校验", () => {
  it("合法文章 frontmatter 通过校验", () => {
    const result = articleSchema.safeParse({
      title: "测试文章",
      slug: "test-article",
      summary: "这是一段足够长的摘要文字用于测试。",
      category: "基础认知",
      audiences: ["家长"],
      ageGroups: ["2-6岁"],
      tags: ["测试"],
      readingTime: 5,
      lastUpdated: "2026-01-01",
      reviewStatus: "published",
      reviewerRole: "编辑整理",
      sources: [],
    });
    expect(result.success).toBe(true);
  });

  it("非法 slug / 日期 / 分类被拒绝", () => {
    const base = {
      title: "测试",
      slug: "Test Article!",
      summary: "这是一段足够长的摘要文字用于测试。",
      category: "不存在的分类",
      audiences: ["家长"],
      ageGroups: ["2-6岁"],
      tags: ["t"],
      readingTime: 5,
      lastUpdated: "2026/01/01",
      reviewStatus: "published",
      reviewerRole: "编辑",
    };
    expect(articleSchema.safeParse(base).success).toBe(false);
    expect(
      articleSchema.safeParse({ ...base, slug: "ok-slug", category: "基础认知" }).success,
    ).toBe(false); // 日期仍非法
  });

  it("资源 frontmatter 需要模板字段", () => {
    const result = resourceSchema.safeParse({
      title: "测试资源",
      slug: "test-res",
      summary: "这是一段足够长的摘要文字用于测试。",
      category: "视觉日程",
      audiences: ["家长"],
      ageGroups: ["2-6岁"],
      tags: ["t"],
      lastUpdated: "2026-01-01",
      reviewStatus: "published",
      reviewerRole: "编辑",
      fileFormat: "HTML",
      license: "免费",
      template: "not-exist-template",
    });
    // schema 本身通过（template 是 string），有效性由 validateResourceTemplates 检查
    expect(result.success).toBe(true);
  });
});

describe("内容仓库", () => {
  it("能加载所有已发布内容", () => {
    expect(getArticles().length).toBeGreaterThanOrEqual(12);
    expect(getCourses().length).toBeGreaterThanOrEqual(8);
    expect(getResources().length).toBeGreaterThanOrEqual(8);
    expect(getSafetyGuides().length).toBe(3);
  });

  it("slug 唯一且 related 链接有效", () => {
    expect(validateContentGraph()).toEqual([]);
  });

  it("资源模板都已注册", () => {
    expect(validateResourceTemplates()).toEqual([]);
  });

  it("非 published 内容不进入列表", () => {
    for (const item of [...getArticles(), ...getCourses(), ...getResources()]) {
      expect(item.meta.reviewStatus).toBe("published");
    }
  });
});

describe("目录提取", () => {
  it("提取 h2/h3 并生成唯一 id", () => {
    const toc = extractToc("## 第一节\n正文\n### 小节\n## 第一节\n");
    expect(toc).toHaveLength(3);
    expect(toc[0]).toMatchObject({ depth: 2, text: "第一节" });
    expect(toc[1].depth).toBe(3);
    expect(toc[2].id).not.toBe(toc[0].id);
  });

  it("空内容返回空数组", () => {
    expect(extractToc("没有标题的正文")).toEqual([]);
  });
});
