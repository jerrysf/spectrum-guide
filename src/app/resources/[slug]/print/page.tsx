import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { getResource, getResources } from "@/lib/content";
import { PrintTemplate } from "@/components/print-templates";
import { PrintButton } from "@/components/print-button";
import { Button } from "@/components/ui/button";

export function generateStaticParams() {
  return getResources().map(({ meta }) => ({ slug: meta.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/resources/[slug]/print">): Promise<Metadata> {
  const { slug } = await params;
  const resource = getResource(slug);
  return {
    title: resource ? `${resource.meta.title}（打印版）` : "打印模板",
    robots: { index: false },
  };
}

export default async function ResourcePrintPage({ params }: PageProps<"/resources/[slug]/print">) {
  const { slug } = await params;
  const resource = getResource(slug);
  if (!resource) notFound();

  return (
    <div className="print-page bg-muted/30 py-8 print:bg-white print:py-0">
      <div className="no-print mx-auto mb-6 flex max-w-3xl items-center justify-between px-4">
        <Button asChild variant="ghost" size="sm">
          <Link href={`/resources/${slug}`}>
            <ArrowLeft aria-hidden="true" />
            返回资源详情
          </Link>
        </Button>
        <PrintButton label="打印 / 另存为 PDF" />
      </div>
      <PrintTemplate meta={resource.meta} />
    </div>
  );
}
