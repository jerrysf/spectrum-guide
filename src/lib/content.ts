import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import {
  articleSchema,
  courseSchema,
  resourceSchema,
  safetySchema,
  type ArticleMeta,
  type CourseMeta,
  type ResourceMeta,
  type SafetyMeta,
} from "@/schemas/content";
import { PRINT_TEMPLATES, type PrintTemplateId } from "@/lib/print-templates";

const CONTENT_ROOT = path.join(process.cwd(), "content");

export type ContentKind = "knowledge" | "courses" | "resources" | "safety";

export interface ContentItem<T> {
  meta: T;
  body: string;
}

function loadKind<T>(kind: ContentKind, schema: z.ZodType<T>): ContentItem<T>[] {
  const dir = path.join(CONTENT_ROOT, kind);
  if (!fs.existsSync(dir)) return [];

  const strict = process.env.CONTENT_STRICT !== "0";
  const items: ContentItem<T>[] = [];

  for (const file of fs.readdirSync(dir).sort()) {
    if (!file.endsWith(".mdx")) continue;
    const raw = fs.readFileSync(path.join(dir, file), "utf8");
    const { data, content } = matter(raw);
    const result = schema.safeParse(data);
    if (!result.success) {
      const message = `内容校验失败 ${kind}/${file}:\n${z.prettifyError(result.error)}`;
      if (strict) throw new Error(message);
      console.warn(message);
      continue;
    }
    items.push({ meta: result.data, body: content.trim() });
  }
  return items;
}

const cache = new Map<ContentKind, ContentItem<unknown>[]>();

function getAll<T>(kind: ContentKind, schema: z.ZodType<T>): ContentItem<T>[] {
  if (!cache.has(kind)) {
    cache.set(kind, loadKind(kind, schema) as ContentItem<unknown>[]);
  }
  return cache.get(kind) as ContentItem<T>[];
}

export function getPublished<T>(kind: ContentKind, schema: z.ZodType<T>): ContentItem<T>[] {
  return getAll(kind, schema).filter(
    (item) => (item.meta as { reviewStatus: string }).reviewStatus === "published",
  );
}

function findBySlug<T>(kind: ContentKind, schema: z.ZodType<T>, slug: string) {
  return getPublished(kind, schema).find((item) => (item.meta as { slug: string }).slug === slug);
}

export const getArticles = () => getPublished<ArticleMeta>("knowledge", articleSchema);
export const getArticle = (slug: string) =>
  findBySlug<ArticleMeta>("knowledge", articleSchema, slug);
export const getCourses = () => getPublished<CourseMeta>("courses", courseSchema);
export const getCourse = (slug: string) => findBySlug<CourseMeta>("courses", courseSchema, slug);
export const getResources = () => getPublished<ResourceMeta>("resources", resourceSchema);
export const getResource = (slug: string) =>
  findBySlug<ResourceMeta>("resources", resourceSchema, slug);
export const getSafetyGuides = () => getPublished<SafetyMeta>("safety", safetySchema);
export const getSafetyGuide = (slug: string) =>
  findBySlug<SafetyMeta>("safety", safetySchema, slug);

/** 检查所有已发布内容的 slug 唯一性及 related* 链接有效性（供单元测试使用） */
export function validateContentGraph() {
  const errors: string[] = [];
  const byKind = {
    knowledge: getArticles(),
    courses: getCourses(),
    resources: getResources(),
    safety: getSafetyGuides(),
  } as const;

  for (const [kind, items] of Object.entries(byKind)) {
    const seen = new Set<string>();
    for (const item of items) {
      if (seen.has(item.meta.slug)) errors.push(`${kind}: slug 重复 "${item.meta.slug}"`);
      seen.add(item.meta.slug);
    }
  }

  const articleSlugs = new Set(byKind.knowledge.map((i) => i.meta.slug));
  const courseSlugs = new Set(byKind.courses.map((i) => i.meta.slug));
  const resourceSlugs = new Set(byKind.resources.map((i) => i.meta.slug));

  const all = [...byKind.knowledge, ...byKind.courses, ...byKind.resources, ...byKind.safety];
  for (const item of all) {
    for (const s of item.meta.relatedArticles ?? []) {
      if (!articleSlugs.has(s)) errors.push(`"${item.meta.slug}": relatedArticles 无效 "${s}"`);
    }
    for (const s of item.meta.relatedCourses ?? []) {
      if (!courseSlugs.has(s)) errors.push(`"${item.meta.slug}": relatedCourses 无效 "${s}"`);
    }
    for (const s of item.meta.relatedResources ?? []) {
      if (!resourceSlugs.has(s)) errors.push(`"${item.meta.slug}": relatedResources 无效 "${s}"`);
    }
  }
  return errors;
}

/** 资源打印模板必须在模板清单中注册（用于测试校验） */
export function validateResourceTemplates() {
  const errors: string[] = [];
  for (const item of getResources()) {
    if (!PRINT_TEMPLATES.includes(item.meta.template as PrintTemplateId)) {
      errors.push(`资源 "${item.meta.slug}": 未知打印模板 "${item.meta.template}"`);
    }
  }
  return errors;
}
