import type { Metadata } from "next";
import { getResources } from "@/lib/content";
import { RESOURCE_CATEGORIES, type ResourceCategory } from "@/schemas/content";
import { ContentCard } from "@/components/content-card";
import { FilterBar } from "@/components/filter-bar";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "资源下载",
  description:
    "可打印的自制教学与家庭记录模板：视觉日程、图片沟通卡、社交故事、行为观察表、家校沟通表等。无需注册，可直接打印或另存为 PDF。",
};

export default async function ResourcesPage({ searchParams }: PageProps<"/resources">) {
  const { category } = await searchParams;
  const current =
    typeof category === "string" && RESOURCE_CATEGORIES.includes(category as ResourceCategory)
      ? category
      : undefined;

  const resources = getResources().filter(({ meta }) => !current || meta.category === current);

  return (
    <div>
      <PageHeader
        title="资源下载"
        description="所有模板均为本站自制，可在浏览器中打印或另存为 PDF。下载不需要注册，也不要求填写儿童个人信息。"
      />
      <div className="mx-auto max-w-6xl px-4 py-8">
        <FilterBar
          basePath="/resources"
          paramName="category"
          label="资源分类："
          options={RESOURCE_CATEGORIES}
          current={current}
        />
        {resources.length === 0 ? (
          <p className="text-muted-foreground mt-10 text-center">该分类下暂时没有资源。</p>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {resources.map(({ meta }) => (
              <ContentCard
                key={meta.slug}
                title={meta.title}
                summary={meta.summary}
                href={`/resources/${meta.slug}`}
                category={meta.category}
                tags={meta.tags}
                meta={meta.fileFormat}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
