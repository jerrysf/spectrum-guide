import Link from "next/link";
import type { Metadata } from "next";
import { getArticles, getCourses, getResources } from "@/lib/content";
import { ContentCard } from "@/components/content-card";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "家长专区",
  description:
    "为自闭症儿童家长整理的内容入口：理解孩子、家庭观察、日常生活支持、就诊准备与可打印的家庭记录工具。",
};

export default function ParentGuidePage() {
  const articles = getArticles()
    .filter((a) => a.meta.audiences.includes("家长"))
    .slice(0, 6);
  const courses = getCourses()
    .filter((c) => c.meta.audiences.includes("家长"))
    .slice(0, 3);
  const resources = getResources()
    .filter((r) => r.meta.audiences.includes("家长"))
    .slice(0, 4);

  return (
    <div>
      <PageHeader
        title="家长专区"
        description="为家长整理的内容路径：先理解孩子，再观察记录，然后用具体方法支持日常生活。"
      />
      <div className="mx-auto max-w-6xl space-y-12 px-4 py-10">
        <section aria-labelledby="start">
          <h2 id="start" className="text-lg font-semibold">
            建议从这里开始
          </h2>
          <ol className="mt-4 grid gap-3 sm:grid-cols-3">
            <li className="border-border bg-card rounded-lg border p-4">
              <p className="text-primary text-sm font-semibold">第一步</p>
              <p className="mt-1 font-medium">了解自闭症的基本概念</p>
              <p className="text-muted-foreground mt-1 text-sm">
                读《什么是自闭症谱系障碍》和《常见表现》，先建立整体认识。
              </p>
            </li>
            <li className="border-border bg-card rounded-lg border p-4">
              <p className="text-primary text-sm font-semibold">第二步</p>
              <p className="mt-1 font-medium">在日常中观察记录</p>
              <p className="text-muted-foreground mt-1 text-sm">
                用发展能力观察工具和家长记录表，积累真实、具体的信息。
              </p>
            </li>
            <li className="border-border bg-card rounded-lg border p-4">
              <p className="text-primary text-sm font-semibold">第三步</p>
              <p className="mt-1 font-medium">选择一门课程开始练习</p>
              <p className="text-muted-foreground mt-1 text-sm">
                从最影响日常生活的领域开始，小步前进，记录变化。
              </p>
            </li>
          </ol>
          <div className="mt-4">
            <Button asChild>
              <Link href="/assessment/development">开始发展能力观察</Link>
            </Button>
          </div>
        </section>

        <section aria-labelledby="parent-articles">
          <div className="flex items-center justify-between">
            <h2 id="parent-articles" className="text-lg font-semibold">
              家长常读的科普
            </h2>
            <Button asChild variant="link" size="sm">
              <Link href="/knowledge">全部文章</Link>
            </Button>
          </div>
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

        <section aria-labelledby="parent-courses">
          <h2 id="parent-courses" className="text-lg font-semibold">
            适合家庭练习的课程
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

        <section aria-labelledby="parent-resources">
          <h2 id="parent-resources" className="text-lg font-semibold">
            家长记录与沟通工具
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
      </div>
    </div>
  );
}
