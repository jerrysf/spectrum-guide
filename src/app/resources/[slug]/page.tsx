import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ExternalLink, FileText } from "lucide-react";
import { getResource, getResources } from "@/lib/content";
import { extractToc } from "@/lib/mdx";
import { ArticleToc } from "@/components/article-toc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MdxBody } from "@/components/mdx-body";
import { ReviewBadge } from "@/components/review-badge";
import { PrintTemplate } from "@/components/print-templates";
import { PRINT_TEMPLATE_LABELS } from "@/lib/print-templates";
import type { PrintTemplateId } from "@/lib/print-templates";
import { formatDate } from "@/lib/utils";

export function generateStaticParams() {
  return getResources().map(({ meta }) => ({ slug: meta.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/resources/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const resource = getResource(slug);
  if (!resource) return {};
  return {
    title: resource.meta.title,
    description: resource.meta.summary,
    alternates: { canonical: `/resources/${slug}` },
  };
}

export default async function ResourcePage({ params }: PageProps<"/resources/[slug]">) {
  const { slug } = await params;
  const resource = getResource(slug);
  if (!resource) notFound();

  const { meta, body } = resource;
  const toc = extractToc(body);

  return (
    <article className="mx-auto max-w-6xl px-4 py-10">
      <nav aria-label="面包屑" className="text-muted-foreground text-sm">
        <Link href="/resources" className="hover:text-primary hover:underline">
          资源下载
        </Link>
        <span className="mx-2">/</span>
        <span>{meta.category}</span>
      </nav>

      <header className="mt-4 max-w-3xl">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{meta.category}</Badge>
          <Badge variant="outline">{meta.fileFormat}</Badge>
        </div>
        <h1 className="mt-3 text-2xl leading-tight font-bold sm:text-3xl">{meta.title}</h1>
        <p className="text-muted-foreground mt-3">{meta.summary}</p>
        <div className="text-muted-foreground mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
          <span>适用对象：{meta.audiences.join("、")}</span>
          <span>年龄段：{meta.ageGroups.join("、")}</span>
          <time dateTime={meta.lastUpdated}>更新于 {formatDate(meta.lastUpdated)}</time>
        </div>
        <div className="mt-2">
          <ReviewBadge status={meta.reviewStatus} role={meta.reviewerRole} />
        </div>
        <div className="border-border bg-primary-soft/40 mt-5 rounded-lg border p-4">
          <p className="text-sm">
            <FileText className="mr-1 inline h-4 w-4" aria-hidden="true" />
            模板格式：
            {PRINT_TEMPLATE_LABELS[meta.template as PrintTemplateId] ?? meta.fileFormat}
            ，在浏览器中打开后可打印或另存为 PDF。
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            <Button asChild>
              <Link href={`/resources/${meta.slug}/print`}>
                <ExternalLink aria-hidden="true" />
                打开打印模板
              </Link>
            </Button>
          </div>
          <p className="text-muted-foreground mt-2 text-xs">
            授权信息：{meta.license}。下载与打印不需要填写儿童个人信息。
          </p>
        </div>
      </header>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_260px]">
        <div>
          <div className="lg:hidden">
            <ArticleToc items={toc} />
          </div>
          <MdxBody source={body} />
          <section aria-labelledby="preview" className="border-border mt-10 border-t pt-6">
            <h2 id="preview" className="text-base font-semibold">
              模板预览
            </h2>
            <div className="border-border mt-4 overflow-hidden rounded-lg border">
              <PrintTemplate meta={meta} />
            </div>
          </section>
        </div>
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <ArticleToc items={toc} />
          </div>
        </aside>
      </div>
    </article>
  );
}
