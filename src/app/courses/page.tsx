import type { Metadata } from "next";
import { getCourses } from "@/lib/content";
import { ContentCard } from "@/components/content-card";
import { FilterBar } from "@/components/filter-bar";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "干预课程",
  description:
    "具体、可执行的家庭与教学干预课程：功能性沟通、模仿、轮流游戏、视觉日程、生活自理、情绪调节等。",
};

const COURSE_TAGS = [
  "功能性沟通",
  "模仿",
  "轮流游戏",
  "视觉日程",
  "生活自理",
  "情绪调节",
  "环境调整",
  "家校协作",
] as const;

export default async function CoursesPage({ searchParams }: PageProps<"/courses">) {
  const { tag } = await searchParams;
  const currentTag = typeof tag === "string" ? tag : undefined;

  const courses = getCourses().filter(({ meta }) => {
    if (currentTag && !meta.tags.includes(currentTag)) return false;
    return true;
  });

  return (
    <div>
      <PageHeader
        title="干预课程"
        description="每门课程包含目标、适用场景、操作步骤、提示策略与进展观察方法。课程不构成医疗建议。"
      />
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="space-y-3">
          <FilterBar
            basePath="/courses"
            paramName="tag"
            label="课程主题："
            options={COURSE_TAGS}
            current={currentTag}
          />
        </div>
        {courses.length === 0 ? (
          <p className="text-muted-foreground mt-10 text-center">没有符合条件的课程。</p>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map(({ meta }) => (
              <ContentCard
                key={meta.slug}
                title={meta.title}
                summary={meta.summary}
                href={`/courses/${meta.slug}`}
                category="干预课程"
                tags={meta.tags}
                meta={meta.duration}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
