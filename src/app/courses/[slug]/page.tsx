import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCourse, getCourses, getResource } from "@/lib/content";
import { extractToc } from "@/lib/mdx";
import { ArticleToc } from "@/components/article-toc";
import { DisclaimerNote } from "@/components/disclaimer-note";
import { MdxBody } from "@/components/mdx-body";
import { ReviewBadge } from "@/components/review-badge";
import { SourcesList } from "@/components/sources-list";
import { formatDate } from "@/lib/utils";

export function generateStaticParams() {
  return getCourses().map(({ meta }) => ({ slug: meta.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/courses/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const course = getCourse(slug);
  if (!course) return {};
  return {
    title: course.meta.title,
    description: course.meta.summary,
    alternates: { canonical: `/courses/${slug}` },
  };
}

export default async function CoursePage({ params }: PageProps<"/courses/[slug]">) {
  const { slug } = await params;
  const course = getCourse(slug);
  if (!course) notFound();

  const { meta, body } = course;
  const toc = extractToc(body);
  const relatedResources = meta.relatedResources
    .map((s) => getResource(s))
    .filter((a): a is NonNullable<typeof a> => Boolean(a));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: meta.title,
    description: meta.summary,
    inLanguage: "zh-CN",
  };

  return (
    <article className="mx-auto max-w-6xl px-4 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="面包屑" className="text-muted-foreground text-sm">
        <Link href="/courses" className="hover:text-primary hover:underline">
          干预课程
        </Link>
        <span className="mx-2">/</span>
        <span>{meta.title}</span>
      </nav>

      <header className="mt-4 max-w-3xl">
        <h1 className="text-2xl leading-tight font-bold sm:text-3xl">{meta.title}</h1>
        <p className="text-muted-foreground mt-3">{meta.summary}</p>
        <div className="text-muted-foreground mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
          {meta.duration && <span>建议时长：{meta.duration}</span>}
          <span>适用人群：{meta.audiences.join("、")}</span>
          <span>年龄段：{meta.ageGroups.join("、")}</span>
          <time dateTime={meta.lastUpdated}>更新于 {formatDate(meta.lastUpdated)}</time>
        </div>
        <div className="mt-2">
          <ReviewBadge status={meta.reviewStatus} role={meta.reviewerRole} />
        </div>
      </header>

      <section
        aria-label="课程概要"
        className="border-border bg-card mt-6 grid gap-4 rounded-xl border p-5 sm:grid-cols-2"
      >
        <div>
          <h2 className="text-sm font-semibold">目标技能</h2>
          <ul className="text-muted-foreground mt-2 list-disc pl-5 text-sm">
            {meta.targetSkills.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold">适用场景</h2>
          <ul className="text-muted-foreground mt-2 list-disc pl-5 text-sm">
            {meta.settings.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
        {meta.prerequisites.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold">前置能力</h2>
            <ul className="text-muted-foreground mt-2 list-disc pl-5 text-sm">
              {meta.prerequisites.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        )}
        {meta.materials.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold">所需材料</h2>
            <ul className="text-muted-foreground mt-2 list-disc pl-5 text-sm">
              {meta.materials.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_260px]">
        <div>
          <div className="lg:hidden">
            <ArticleToc items={toc} />
          </div>
          <MdxBody source={body} />
          <SourcesList sources={meta.sources} />
          <DisclaimerNote />
        </div>
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-6">
            <ArticleToc items={toc} />
            {relatedResources.length > 0 && (
              <div className="border-border bg-muted/40 rounded-lg border p-4 text-sm">
                <p className="font-semibold">配套资源</p>
                <ul className="mt-2 space-y-1.5">
                  {relatedResources.map(({ meta: m }) => (
                    <li key={m.slug}>
                      <Link
                        href={`/resources/${m.slug}`}
                        className="text-muted-foreground hover:text-primary"
                      >
                        {m.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </aside>
      </div>
    </article>
  );
}
