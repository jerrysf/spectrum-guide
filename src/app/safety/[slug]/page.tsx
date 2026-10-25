import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getSafetyGuide, getSafetyGuides } from "@/lib/content";
import { extractToc } from "@/lib/mdx";
import { ArticleToc } from "@/components/article-toc";
import { Badge } from "@/components/ui/badge";
import { MdxBody } from "@/components/mdx-body";
import { ReviewBadge } from "@/components/review-badge";
import { SourcesList } from "@/components/sources-list";
import { PrintButton } from "@/components/print-button";
import { formatDate } from "@/lib/utils";

export function generateStaticParams() {
  return getSafetyGuides().map(({ meta }) => ({ slug: meta.slug }));
}

export async function generateMetadata({ params }: PageProps<"/safety/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const guide = getSafetyGuide(slug);
  if (!guide) return {};
  return {
    title: guide.meta.title,
    description: guide.meta.summary,
    alternates: { canonical: `/safety/${slug}` },
  };
}

export default async function SafetyGuidePage({ params }: PageProps<"/safety/[slug]">) {
  const { slug } = await params;
  const guide = getSafetyGuide(slug);
  if (!guide) notFound();

  const { meta, body } = guide;
  const toc = extractToc(body);

  return (
    <article className="mx-auto max-w-6xl px-4 py-10">
      <nav aria-label="面包屑" className="text-muted-foreground text-sm">
        <Link href="/safety" className="hover:text-primary hover:underline">
          安全指南
        </Link>
        <span className="mx-2">/</span>
        <span>{meta.title}</span>
      </nav>

      <header className="mt-4 max-w-3xl">
        <Badge variant="amber">{meta.dangerLevel}</Badge>
        <h1 className="mt-3 text-2xl leading-tight font-bold sm:text-3xl">{meta.title}</h1>
        <p className="text-muted-foreground mt-3">{meta.summary}</p>
        <div className="text-muted-foreground mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
          <time dateTime={meta.lastUpdated}>更新于 {formatDate(meta.lastUpdated)}</time>
          <ReviewBadge status={meta.reviewStatus} role={meta.reviewerRole} />
          <span className="no-print">
            <PrintButton label="打印本指南" />
          </span>
        </div>
      </header>

      <div className="bg-accent-amber/60 mt-6 rounded-lg border border-amber-600/30 p-4 text-sm">
        <p>
          如正发生危及生命安全的情况（严重自伤、冲到马路、呼吸异常、意识改变），
          请立即拨打当地急救电话（中国大陆：120）或报警（110）。
        </p>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_260px]">
        <div>
          <div className="lg:hidden">
            <ArticleToc items={toc} />
          </div>
          <MdxBody source={body} />
          <SourcesList sources={meta.sources} />
          <p className="border-border bg-muted/50 text-muted-foreground mt-8 rounded-md border p-4 text-xs">
            本指南只提供一般性的现场安全建议，不能替代专业人员对孩子情况的个体化评估。
            涉及反复自伤、攻击或走失风险时，请寻求行为干预、精神心理或发育行为专科的个别化支持。
          </p>
        </div>
        <aside className="no-print hidden lg:block">
          <div className="sticky top-24">
            <ArticleToc items={toc} />
          </div>
        </aside>
      </div>
    </article>
  );
}
