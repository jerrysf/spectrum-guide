import { z } from "zod";

export const CATEGORIES = [
  "基础认知",
  "社交沟通",
  "感官特点",
  "情绪与行为",
  "日常生活",
  "医学与就医",
] as const;

export const AGE_GROUPS = ["2-6岁", "学龄期", "青少年", "成人"] as const;

export const AUDIENCES = ["家长", "特教老师", "康复师", "普通用户"] as const;

export const REVIEW_STATUSES = ["draft", "needs_review", "reviewed", "published"] as const;

export const SOURCE_TYPES = [
  "guideline",
  "systematic_review",
  "research",
  "book",
  "official_page",
  "manual",
] as const;

export const categorySchema = z.enum(CATEGORIES);
export const ageGroupSchema = z.enum(AGE_GROUPS);
export const audienceSchema = z.enum(AUDIENCES);
export const reviewStatusSchema = z.enum(REVIEW_STATUSES);

export const sourceSchema = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
  year: z.number().int().min(1900).max(2100).optional(),
  url: z.url().optional(),
  type: z.enum(SOURCE_TYPES),
});

const baseFields = {
  title: z.string().min(1).max(120),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug 只能包含小写字母、数字和连字符"),
  summary: z.string().min(10).max(300),
  lastUpdated: z.preprocess(
    // gray-matter/js-yaml 会把未加引号的日期解析为 Date 对象，统一转为 ISO 日期字符串
    (v) => (v instanceof Date ? v.toISOString().slice(0, 10) : v),
    z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "日期格式为 YYYY-MM-DD"),
  ),
  reviewStatus: reviewStatusSchema,
  reviewerRole: z.string().min(1),
  sources: z.array(sourceSchema).default([]),
  relatedArticles: z.array(z.string()).default([]),
  relatedCourses: z.array(z.string()).default([]),
  relatedResources: z.array(z.string()).default([]),
};

export const articleSchema = z.object({
  ...baseFields,
  category: categorySchema,
  audiences: z.array(audienceSchema).min(1),
  ageGroups: z.array(ageGroupSchema).min(1),
  tags: z.array(z.string()).min(1),
  readingTime: z.number().int().positive(),
});

export const courseSchema = z.object({
  ...baseFields,
  targetSkills: z.array(z.string()).min(1),
  settings: z.array(z.string()).min(1),
  prerequisites: z.array(z.string()).default([]),
  materials: z.array(z.string()).default([]),
  audiences: z.array(audienceSchema).min(1),
  ageGroups: z.array(ageGroupSchema).min(1),
  tags: z.array(z.string()).min(1),
  duration: z.string().optional(),
});

export const RESOURCE_CATEGORIES = [
  "视觉日程",
  "图片沟通卡",
  "社交故事",
  "生活自理流程卡",
  "行为观察表",
  "教学记录表",
  "家长记录表",
  "家校沟通表",
] as const;

export const resourceSchema = z.object({
  ...baseFields,
  category: z.enum(RESOURCE_CATEGORIES),
  audiences: z.array(audienceSchema).min(1),
  ageGroups: z.array(ageGroupSchema).min(1),
  tags: z.array(z.string()).min(1),
  fileFormat: z.string().min(1),
  license: z.string().min(1),
  template: z.string().min(1),
  templateData: z
    .object({
      title: z.string().optional(),
      instructions: z.array(z.string()).default([]),
      items: z.array(z.string()).default([]),
      columns: z.array(z.string()).default([]),
      rows: z.number().int().positive().optional(),
    })
    .default({ instructions: [], items: [], columns: [] }),
});

export const safetySchema = z.object({
  ...baseFields,
  dangerLevel: z.enum(["紧急", "需关注"]),
  audiences: z.array(audienceSchema).min(1),
  ageGroups: z.array(ageGroupSchema).min(1),
  tags: z.array(z.string()).min(1),
});

export type Source = z.infer<typeof sourceSchema>;
export type Category = z.infer<typeof categorySchema>;
export type AgeGroup = z.infer<typeof ageGroupSchema>;
export type Audience = z.infer<typeof audienceSchema>;
export type ReviewStatus = z.infer<typeof reviewStatusSchema>;
export type ArticleMeta = z.infer<typeof articleSchema>;
export type CourseMeta = z.infer<typeof courseSchema>;
export type ResourceMeta = z.infer<typeof resourceSchema>;
export type SafetyMeta = z.infer<typeof safetySchema>;
export type ResourceCategory = (typeof RESOURCE_CATEGORIES)[number];
