import type { Metadata } from "next";
import { getArticles } from "@/lib/content";
import { CATEGORIES, type Category } from "@/schemas/content";
import { ContentCard } from "@/components/content-card";
import { FilterBar } from "@/components/filter-bar";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "科普知识",
  description:
    "循证、通俗的自闭症科普文章：基础认知、社交沟通、感官特点、情绪与行为、日常生活、医学与就医。",
};

export default async function KnowledgePage({ searchParams }: PageProps<"/knowledge">) {
  const { category } = await searchParams;
  const current = typeof category === "string" ? category : undefined;
  const valid = CATEGORIES.includes(current as Category) ? (current as Category) : undefined;

  const articles = getArticles().filter((a) => !valid || a.meta.category === valid);

  return (
    <div>
      <PageHeader
        title="科普知识"
        description="循证、通俗的自闭症科普内容。每篇文章标注更新时间、审核状态与参考来源。"
      />
      <div className="mx-auto max-w-6xl px-4 py-8">
        <FilterBar
          basePath="/knowledge"
          paramName="category"
          label="主题分类："
          options={CATEGORIES}
          current={valid}
        />
        {articles.length === 0 ? (
          <p className="text-muted-foreground mt-10 text-center">
            该分类下暂时没有文章，换个分类看看。
          </p>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map(({ meta }) => (
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
        )}
      </div>
    </div>
  );
}
