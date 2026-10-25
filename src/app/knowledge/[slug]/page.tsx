import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Clock, Flag } from "lucide-react";
import { getArticle, getArticles, getCourse, getResource } from "@/lib/content";
import { extractToc } from "@/lib/mdx";
import { ArticleToc } from "@/components/article-toc";
import { Badge } from "@/components/ui/badge";
import { DisclaimerNote } from "@/components/disclaimer-note";
import { MdxBody } from "@/components/mdx-body";
import { ReviewBadge } from "@/components/review-badge";
import { SourcesList } from "@/components/sources-list";
import { CONTACT_EMAIL, SITE_NAME, SITE_URL, formatDate } from "@/lib/utils";

export function generateStaticParams() {
  return getArticles().map(({ meta }) => ({ slug: meta.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/knowledge/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  return {
    title: article.meta.title,
    description: article.meta.summary,
    alternates: { canonical: `/knowledge/${slug}` },
    openGraph: {
      title: article.meta.title,
      description: article.meta.summary,
      type: "article",
      modifiedTime: article.meta.lastUpdated,
    },
  };
}

export default async function ArticlePage({ params }: PageProps<"/knowledge/[slug]">) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const { meta, body } = article;
  const toc = extractToc(body);

  const relatedArticles = meta.relatedArticles
    .map((s) => getArticle(s))
    .filter((a): a is NonNullable<typeof a> => Boolean(a));
  const relatedCourses = meta.relatedCourses
    .map((s) => getCourse(s))
    .filter((a): a is NonNullable<typeof a> => Boolean(a));
  const relatedResources = meta.relatedResources
    .map((s) => getResource(s))
    .filter((a): a is NonNullable<typeof a> => Boolean(a));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: meta.title,
    description: meta.summary,
    dateModified: meta.lastUpdated,
    inLanguage: "zh-CN",
    author: { "@type": "Organization", name: SITE_NAME },
    mainEntityOfPage: `${SITE_URL}/knowledge/${meta.slug}`,
  };

  return (
    <article className="mx-auto max-w-6xl px-4 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="面包屑" className="text-muted-foreground text-sm">
        <Link href="/knowledge" className="hover:text-primary hover:underline">
          科普知识
        </Link>
        <span className="mx-2">/</span>
        <span>{meta.category}</span>
      </nav>

      <header className="mt-4 max-w-3xl">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{meta.category}</Badge>
          {meta.tags.map((t) => (
            <Badge key={t} variant="outline">
              {t}
            </Badge>
          ))}
        </div>
        <h1 className="mt-3 text-2xl leading-tight font-bold sm:text-3xl">{meta.title}</h1>
        <p className="text-muted-foreground mt-3">{meta.summary}</p>
        <div className="text-muted-foreground mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
          <span className="inline-flex items-center gap-1">
            <Clock className="h-4 w-4" aria-hidden="true" />约 {meta.readingTime} 分钟
          </span>
          <span>适用人群：{meta.audiences.join("、")}</span>
          <span>年龄段：{meta.ageGroups.join("、")}</span>
          <time dateTime={meta.lastUpdated}>更新于 {formatDate(meta.lastUpdated)}</time>
        </div>
        <div className="mt-2">
          <ReviewBadge status={meta.reviewStatus} role={meta.reviewerRole} />
        </div>
      </header>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_260px]">
        <div>
          <div className="lg:hidden">
            <ArticleToc items={toc} />
          </div>
          <MdxBody source={body} />
          <SourcesList sources={meta.sources} />
          <p className="mt-8 text-sm">
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`内容纠错：${meta.title}`)}`}
              className="text-muted-foreground hover:text-primary inline-flex items-center gap-1"
            >
              <Flag className="h-4 w-4" aria-hidden="true" />
              发现内容有误？向我们反馈
            </a>
          </p>
          <DisclaimerNote />
        </div>
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-6">
            <ArticleToc items={toc} />
          </div>
        </aside>
      </div>

      {(relatedArticles.length > 0 || relatedCourses.length > 0 || relatedResources.length > 0) && (
        <section aria-labelledby="related" className="border-border mt-12 border-t pt-8">
          <h2 id="related" className="text-lg font-semibold">
            相关内容
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {relatedArticles.map(({ meta: m }) => (
              <li key={m.slug} className="border-border bg-card rounded-lg border p-4">
                <Badge variant="blue">科普</Badge>
                <Link
                  href={`/knowledge/${m.slug}`}
                  className="hover:text-primary mt-2 block font-medium hover:underline"
                >
                  {m.title}
                </Link>
              </li>
            ))}
            {relatedCourses.map(({ meta: m }) => (
              <li key={m.slug} className="border-border bg-card rounded-lg border p-4">
                <Badge variant="purple">课程</Badge>
                <Link
                  href={`/courses/${m.slug}`}
                  className="hover:text-primary mt-2 block font-medium hover:underline"
                >
                  {m.title}
                </Link>
              </li>
            ))}
            {relatedResources.map(({ meta: m }) => (
              <li key={m.slug} className="border-border bg-card rounded-lg border p-4">
                <Badge variant="amber">资源</Badge>
                <Link
                  href={`/resources/${m.slug}`}
                  className="hover:text-primary mt-2 block font-medium hover:underline"
                >
                  {m.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
