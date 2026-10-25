import type { Metadata } from "next";
import { getArticles, getCourses, getResources } from "@/lib/content";
import { ContentCard } from "@/components/content-card";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "专业人员专区",
  description: "为特殊教育教师和康复师整理的内容入口：教学策略、课堂支持、记录工具与家校协作方法。",
};

export default function ProfessionalPage() {
  const articles = getArticles()
    .filter((a) => a.meta.audiences.includes("特教老师") || a.meta.audiences.includes("康复师"))
    .slice(0, 6);
  const courses = getCourses()
    .filter((c) => c.meta.audiences.includes("特教老师") || c.meta.audiences.includes("康复师"))
    .slice(0, 4);
  const resources = getResources()
    .filter((r) => r.meta.audiences.includes("特教老师") || r.meta.audiences.includes("康复师"))
    .slice(0, 4);

  return (
    <div>
      <PageHeader
        title="特教老师与康复师专区"
        description="教学策略、课堂支持工具与家校协作方法。所有课程与模板都围绕可观察、可记录的目标设计。"
      />
      <div className="mx-auto max-w-6xl space-y-12 px-4 py-10">
        <section aria-labelledby="pro-courses">
          <h2 id="pro-courses" className="text-lg font-semibold">
            教学与干预课程
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {courses.map(({ meta }) => (
              <ContentCard
                key={meta.slug}
                title={meta.title}
                summary={meta.summary}
                href={`/courses/${meta.slug}`}
                category="干预课程"
                tags={meta.tags}
              />
            ))}
          </div>
        </section>

        <section aria-labelledby="pro-resources">
          <h2 id="pro-resources" className="text-lg font-semibold">
            记录与教学工具
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {resources.map(({ meta }) => (
              <ContentCard
                key={meta.slug}
                title={meta.title}
                summary={meta.summary}
                href={`/resources/${meta.slug}`}
                category={meta.category}
              />
            ))}
          </div>
        </section>

        <section aria-labelledby="pro-articles">
          <h2 id="pro-articles" className="text-lg font-semibold">
            背景知识
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map(({ meta }) => (
              <ContentCard
                key={meta.slug}
                title={meta.title}
                summary={meta.summary}
                href={`/knowledge/${meta.slug}`}
                category={meta.category}
                tags={meta.tags}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
