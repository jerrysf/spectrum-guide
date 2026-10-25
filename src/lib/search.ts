import { getArticles, getCourses, getResources, getSafetyGuides } from "@/lib/content";
import type { Audience, AgeGroup, Category } from "@/schemas/content";

export type SearchType = "article" | "course" | "resource" | "safety";

export interface SearchDoc {
  type: SearchType;
  typeLabel: string;
  title: string;
  slug: string;
  url: string;
  summary: string;
  category: string;
  tags: string[];
  audiences: string[];
  ageGroups: string[];
  text: string; // 用于匹配的合并文本（含正文片段）
}

export interface SearchFilters {
  q?: string;
  type?: string;
  category?: string;
  audience?: string;
  ageGroup?: string;
  page?: number;
}

export interface SearchResult {
  items: SearchDoc[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export const PAGE_SIZE = 12;

const TYPE_LABELS: Record<SearchType, string> = {
  article: "科普知识",
  course: "干预课程",
  resource: "实用资源",
  safety: "安全指南",
};

function stripMdx(body: string): string {
  return body
    .replace(/^---[\s\S]*?---/m, "")
    .replace(/[#>*`|-]/g, " ")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

export function buildSearchIndex(): SearchDoc[] {
  const docs: SearchDoc[] = [];

  for (const { meta, body } of getArticles()) {
    docs.push({
      type: "article",
      typeLabel: TYPE_LABELS.article,
      title: meta.title,
      slug: meta.slug,
      url: `/knowledge/${meta.slug}`,
      summary: meta.summary,
      category: meta.category,
      tags: meta.tags,
      audiences: meta.audiences,
      ageGroups: meta.ageGroups,
      text: `${meta.title} ${meta.summary} ${meta.tags.join(" ")} ${stripMdx(body)}`,
    });
  }
  for (const { meta, body } of getCourses()) {
    docs.push({
      type: "course",
      typeLabel: TYPE_LABELS.course,
      title: meta.title,
      slug: meta.slug,
      url: `/courses/${meta.slug}`,
      summary: meta.summary,
      category: "干预课程",
      tags: meta.tags,
      audiences: meta.audiences,
      ageGroups: meta.ageGroups,
      text: `${meta.title} ${meta.summary} ${meta.tags.join(" ")} ${meta.targetSkills.join(" ")} ${stripMdx(body)}`,
    });
  }
  for (const { meta, body } of getResources()) {
    docs.push({
      type: "resource",
      typeLabel: TYPE_LABELS.resource,
      title: meta.title,
      slug: meta.slug,
      url: `/resources/${meta.slug}`,
      summary: meta.summary,
      category: meta.category,
      tags: meta.tags,
      audiences: meta.audiences,
      ageGroups: meta.ageGroups,
      text: `${meta.title} ${meta.summary} ${meta.tags.join(" ")} ${meta.category} ${stripMdx(body)}`,
    });
  }
  for (const { meta, body } of getSafetyGuides()) {
    docs.push({
      type: "safety",
      typeLabel: TYPE_LABELS.safety,
      title: meta.title,
      slug: meta.slug,
      url: `/safety/${meta.slug}`,
      summary: meta.summary,
      category: "安全指南",
      tags: meta.tags,
      audiences: meta.audiences,
      ageGroups: meta.ageGroups,
      text: `${meta.title} ${meta.summary} ${meta.tags.join(" ")} ${stripMdx(body)}`,
    });
  }
  return docs;
}

export function searchDocs(docs: SearchDoc[], filters: SearchFilters): SearchResult {
  let result = docs;

  const q = (filters.q ?? "").trim().toLowerCase();
  if (q) {
    const terms = q.split(/\s+/).filter(Boolean);
    result = result.filter((d) => terms.every((t) => d.text.toLowerCase().includes(t)));
    // 简单排序：标题命中优先，其次摘要，最后正文
    result = [...result].sort((a, b) => score(b, terms) - score(a, terms));
  }
  if (filters.type && filters.type in TYPE_LABELS) {
    result = result.filter((d) => d.type === filters.type);
  }
  if (filters.category) {
    result = result.filter((d) => d.category === filters.category);
  }
  if (filters.audience) {
    result = result.filter((d) => d.audiences.includes(filters.audience as Audience));
  }
  if (filters.ageGroup) {
    result = result.filter((d) => d.ageGroups.includes(filters.ageGroup as AgeGroup));
  }

  const total = result.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(Math.max(1, filters.page ?? 1), totalPages);
  return {
    items: result.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    total,
    page,
    pageSize: PAGE_SIZE,
    totalPages,
  };
}

function score(doc: SearchDoc, terms: string[]): number {
  let s = 0;
  const title = doc.title.toLowerCase();
  const summary = doc.summary.toLowerCase();
  for (const t of terms) {
    if (title.includes(t)) s += 10;
    if (summary.includes(t)) s += 5;
    if (doc.tags.some((tag) => tag.toLowerCase().includes(t))) s += 4;
  }
  return s;
}

export function searchAll(filters: SearchFilters): SearchResult {
  return searchDocs(buildSearchIndex(), filters);
}

/** 供筛选 UI 使用的分类全集 */
export const SEARCH_CATEGORIES: (Category | string)[] = [
  "基础认知",
  "社交沟通",
  "感官特点",
  "情绪与行为",
  "日常生活",
  "医学与就医",
  "视觉日程",
  "图片沟通卡",
  "社交故事",
  "生活自理流程卡",
  "行为观察表",
  "教学记录表",
  "家长记录表",
  "家校沟通表",
  "干预课程",
  "安全指南",
];
