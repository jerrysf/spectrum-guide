import Link from "next/link";
import type { Metadata } from "next";
import {
  Baby,
  BookOpen,
  ClipboardList,
  Download,
  GraduationCap,
  HeartHandshake,
  ShieldAlert,
  Sparkles,
  Users,
} from "lucide-react";
import { getArticles, getCourses, getResources } from "@/lib/content";
import { ContentCard } from "@/components/content-card";
import { SearchBox } from "@/components/search-box";
import { Button } from "@/components/ui/button";
import { CATEGORIES, AGE_GROUPS } from "@/schemas/content";

export const metadata: Metadata = {
  title: "星伴成长｜理解孩子，从科学、温和的陪伴开始",
  description:
    "为家长、特教老师和康复师提供可信的自闭症知识、实用课程与成长支持工具。循证、通俗、可直接用于日常生活与教学。",
};

const AGE_ICONS = [Baby, BookOpen, GraduationCap, Users] as const;

const AUDIENCE_LINKS = [
  { label: "家长专区", href: "/parent-guide", desc: "家庭观察、生活支持、就诊准备" },
  { label: "特教老师专区", href: "/professional", desc: "教学策略、课堂支持、家校协作" },
  { label: "康复师专区", href: "/professional", desc: "实操方法、记录工具、循证参考" },
];

export default function HomePage() {
  const articles = getArticles();
  const courses = getCourses();
  const resources = getResources();

  const popular = articles.slice(0, 6);
  const recommended = courses.slice(0, 3);
  const resourceList = resources.slice(0, 3);
  const latest = [...articles]
    .sort((a, b) => b.meta.lastUpdated.localeCompare(a.meta.lastUpdated))
    .slice(0, 4);

  return (
    <div>
      {/* 首屏 */}
      <section className="border-border from-primary-soft/50 to-background border-b bg-gradient-to-b">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
          <div className="max-w-3xl">
            <h1 className="text-3xl leading-tight font-bold tracking-tight sm:text-4xl">
              理解孩子，从科学、温和的陪伴开始。
            </h1>
            <p className="text-muted-foreground mt-4 text-lg">
              为家长、特教老师和康复师提供可信的自闭症知识、实用课程与成长支持工具。
            </p>
          </div>
          <div className="mt-8 max-w-2xl">
            <SearchBox />
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/knowledge">
                <BookOpen aria-hidden="true" />
                认识自闭症
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/assessment/development">
                <ClipboardList aria-hidden="true" />
                观察发展能力
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/resources">
                <Download aria-hidden="true" />
                查找教学资源
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 安全提示条 */}
      <div className="border-border bg-accent-amber/60 border-b">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 text-sm">
          <ShieldAlert className="h-4 w-4 shrink-0 text-amber-800" aria-hidden="true" />
          <p>
            孩子出现自伤、走失风险或情绪危机？
            <Link href="/safety" className="text-primary ml-1 font-medium underline">
              查看危险行为安全指南
            </Link>
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl space-y-16 px-4 py-14">
        {/* 按年龄 */}
        <section aria-labelledby="by-age">
          <h2 id="by-age" className="text-xl font-bold">
            按年龄浏览
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {AGE_GROUPS.map((age, i) => {
              const Icon = AGE_ICONS[i];
              return (
                <Link
                  key={age}
                  href={`/search?ageGroup=${encodeURIComponent(age)}`}
                  className="border-border bg-card hover:bg-muted flex items-center gap-3 rounded-lg border p-4 transition-colors"
                >
                  <Icon className="text-primary h-6 w-6" aria-hidden="true" />
                  <span className="font-medium">{age}</span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* 按身份 */}
        <section aria-labelledby="by-audience">
          <h2 id="by-audience" className="text-xl font-bold">
            按身份进入
          </h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {AUDIENCE_LINKS.map((a) => (
              <Link
                key={a.label}
                href={a.href}
                className="border-border bg-card hover:bg-muted rounded-lg border p-5 transition-colors"
              >
                <p className="font-semibold">{a.label}</p>
                <p className="text-muted-foreground mt-1 text-sm">{a.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* 按主题 */}
        <section aria-labelledby="by-category">
          <h2 id="by-category" className="text-xl font-bold">
            按主题浏览
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <Link
                key={c}
                href={`/knowledge?category=${encodeURIComponent(c)}`}
                className="border-border bg-card hover:bg-muted rounded-full border px-4 py-2 text-sm font-medium transition-colors"
              >
                {c}
              </Link>
            ))}
          </div>
        </section>

        {/* 热门科普 */}
        <section aria-labelledby="popular">
          <div className="flex items-center justify-between">
            <h2 id="popular" className="text-xl font-bold">
              热门科普
            </h2>
            <Button asChild variant="link">
              <Link href="/knowledge">查看全部</Link>
            </Button>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {popular.map(({ meta }) => (
              <ContentCard
                key={meta.slug}
                title={meta.title}
                summary={meta.summary}
                href={`/knowledge/${meta.slug}`}
                category={meta.category}
                tags={meta.tags}
                date={meta.lastUpdated}
              />
            ))}
          </div>
        </section>

        {/* 推荐课程 */}
        <section aria-labelledby="courses">
          <div className="flex items-center justify-between">
            <h2 id="courses" className="text-xl font-bold">
              推荐课程
            </h2>
            <Button asChild variant="link">
              <Link href="/courses">查看全部</Link>
            </Button>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recommended.map(({ meta }) => (
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
        </section>

        {/* 实用资源 + 最新更新 */}
        <div className="grid gap-10 lg:grid-cols-5">
          <section aria-labelledby="resources" className="lg:col-span-3">
            <div className="flex items-center justify-between">
              <h2 id="resources" className="text-xl font-bold">
                实用资源
              </h2>
              <Button asChild variant="link">
                <Link href="/resources">查看全部</Link>
              </Button>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {resourceList.map(({ meta }) => (
                <ContentCard
                  key={meta.slug}
                  title={meta.title}
                  summary={meta.summary}
                  href={`/resources/${meta.slug}`}
                  category={meta.category}
                  meta={meta.fileFormat}
                />
              ))}
            </div>
          </section>

          <section aria-labelledby="latest" className="lg:col-span-2">
            <h2 id="latest" className="text-xl font-bold">
              最新更新
            </h2>
            <ul className="mt-4 space-y-3">
              {latest.map(({ meta }) => (
                <li key={meta.slug} className="border-border bg-card rounded-lg border p-4">
                  <Link
                    href={`/knowledge/${meta.slug}`}
                    className="hover:text-primary font-medium hover:underline"
                  >
                    {meta.title}
                  </Link>
                  <p className="text-muted-foreground mt-1 text-xs">
                    更新于 {meta.lastUpdated} · {meta.category}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* 循证原则 */}
        <section
          aria-labelledby="principles"
          className="border-border bg-primary-soft/40 rounded-xl border p-6 sm:p-10"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="text-primary h-5 w-5" aria-hidden="true" />
            <h2 id="principles" className="text-xl font-bold">
              我们的循证原则
            </h2>
          </div>
          <ul className="mt-4 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
            <li className="bg-card rounded-lg p-4">
              <HeartHandshake className="text-primary mb-2 h-5 w-5" aria-hidden="true" />
              <p className="font-medium">循证为主</p>
              <p className="text-muted-foreground mt-1">
                内容以研究证据与权威指南为基础，区分“已知”“常用做法”与“尚不确定”。
              </p>
            </li>
            <li className="bg-card rounded-lg p-4">
              <Users className="text-primary mb-2 h-5 w-5" aria-hidden="true" />
              <p className="font-medium">尊重个体差异</p>
              <p className="text-muted-foreground mt-1">
                不把孩子当成需要“修复”的对象，重视孩子的优势、意愿与沟通方式。
              </p>
            </li>
            <li className="bg-card rounded-lg p-4">
              <ClipboardList className="text-primary mb-2 h-5 w-5" aria-hidden="true" />
              <p className="font-medium">不替代诊断</p>
              <p className="text-muted-foreground mt-1">
                观察工具用于家庭记录与就诊准备，不提供诊断结论或风险评分。
              </p>
            </li>
            <li className="bg-card rounded-lg p-4">
              <ShieldAlert className="text-primary mb-2 h-5 w-5" aria-hidden="true" />
              <p className="font-medium">隐私优先</p>
              <p className="text-muted-foreground mt-1">
                默认不要求登录，观察数据只保存在你自己的浏览器中。
              </p>
            </li>
          </ul>
          <p className="text-muted-foreground mt-6 text-sm">
            所有文章均标注更新时间与参考来源，并经过内容审核流程。
            <Link href="/about/evidence" className="text-primary ml-1 underline">
              了解我们的内容审核与参考来源标准
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}
