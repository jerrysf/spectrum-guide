import { describe, expect, it } from "vitest";
import { buildSearchIndex, searchDocs, PAGE_SIZE } from "@/lib/search";

const index = buildSearchIndex();

describe("搜索索引", () => {
  it("覆盖所有内容类型", () => {
    const types = new Set(index.map((d) => d.type));
    expect(types).toEqual(new Set(["article", "course", "resource", "safety"]));
  });

  it("URL 与各类型路由一致", () => {
    for (const doc of index) {
      expect(doc.url).toMatch(/^\/(knowledge|courses|resources|safety)\/[a-z0-9-]+$/);
    }
  });
});

describe("关键词搜索", () => {
  it("按标题命中", () => {
    const r = searchDocs(index, { q: "自闭症" });
    expect(r.total).toBeGreaterThan(0);
    expect(r.items[0].title).toContain("自闭症");
  });

  it("按正文内容命中", () => {
    const r = searchDocs(index, { q: "褪黑素" });
    expect(r.items.some((d) => d.slug === "sleep-problems")).toBe(true);
  });

  it("多词 AND 匹配", () => {
    const r = searchDocs(index, { q: "洗手 步骤" });
    expect(r.items.every((d) => d.text.toLowerCase().includes("洗手"))).toBe(true);
  });

  it("无结果时返回空数组与分页兜底", () => {
    const r = searchDocs(index, { q: "zzz不存在的关键词xyz" });
    expect(r.total).toBe(0);
    expect(r.items).toEqual([]);
    expect(r.totalPages).toBe(1);
  });
});

describe("筛选", () => {
  it("按类型筛选", () => {
    const r = searchDocs(index, { type: "course" });
    expect(r.items.every((d) => d.type === "course")).toBe(true);
  });

  it("按分类筛选", () => {
    const r = searchDocs(index, { category: "感官特点" });
    expect(r.items.every((d) => d.category === "感官特点")).toBe(true);
    expect(r.total).toBeGreaterThan(0);
  });

  it("按受众筛选", () => {
    const r = searchDocs(index, { audience: "康复师" });
    expect(r.items.every((d) => d.audiences.includes("康复师"))).toBe(true);
  });

  it("按年龄组筛选", () => {
    const r = searchDocs(index, { ageGroup: "2-6岁" });
    expect(r.items.every((d) => d.ageGroups.includes("2-6岁"))).toBe(true);
  });

  it("非法 type 值不产生筛选", () => {
    const r = searchDocs(index, { type: "hacked" });
    expect(r.total).toBe(index.length);
  });
});

describe("分页", () => {
  it("默认每页 PAGE_SIZE 条", () => {
    const r = searchDocs(index, {});
    expect(r.items.length).toBeLessThanOrEqual(PAGE_SIZE);
    expect(r.total).toBe(index.length);
  });

  it("越界页码被钳制", () => {
    const r = searchDocs(index, { page: 999 });
    expect(r.page).toBe(r.totalPages);
  });
});
