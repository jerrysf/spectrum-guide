import Link from "next/link";
import type { Metadata } from "next";
import { searchAll, SEARCH_CATEGORIES } from "@/lib/search";
import { AUDIENCES, AGE_GROUPS } from "@/schemas/content";
import { PageHeader } from "@/components/page-header";
import { SearchBox } from "@/components/search-box";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";

export const metadata: Metadata = {
  title: "全站搜索",
  description: "搜索科普文章、干预课程、实用资源与安全指南。",
};

const TYPE_OPTIONS = [
  { value: "", label: "全部类型" },
  { value: "article", label: "科普知识" },
  { value: "course", label: "干预课程" },
  { value: "resource", label: "实用资源" },
  { value: "safety", label: "安全指南" },
];

export default async function SearchPage({ searchParams }: PageProps<"/search">) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : "";
  const type = typeof sp.type === "string" ? sp.type : undefined;
  const category = typeof sp.category === "string" ? sp.category : undefined;
  const audience = typeof sp.audience === "string" ? sp.audience : undefined;
  const ageGroup = typeof sp.ageGroup === "string" ? sp.ageGroup : undefined;
  const page = Number.parseInt(typeof sp.page === "string" ? sp.page : "1", 10) || 1;

  const hasQuery = q.trim().length > 0 || type || category || audience || ageGroup;
  const result = hasQuery ? searchAll({ q, type, category, audience, ageGroup, page }) : null;

  function pageHref(p: number) {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (type) params.set("type", type);
    if (category) params.set("category", category);
    if (audience) params.set("audience", audience);
    if (ageGroup) params.set("ageGroup", ageGroup);
    if (p > 1) params.set("page", String(p));
    return `/search?${params.toString()}`;
  }

  return (
    <div>
      <PageHeader title="全站搜索" description="搜索科普文章、干预课程、实用资源与安全指南。" />
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="max-w-2xl">
          <SearchBox defaultValue={q} size="default" />
        </div>

        <form
          method="get"
          action="/search"
          className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5"
        >
          <input type="hidden" name="q" value={q} />
          <div>
            <label htmlFor="f-type" className="text-muted-foreground mb-1 block text-xs">
              类型
            </label>
            <Select id="f-type" name="type" defaultValue={type ?? ""}>
              {TYPE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <label htmlFor="f-category" className="text-muted-foreground mb-1 block text-xs">
              分类
            </label>
            <Select id="f-category" name="category" defaultValue={category ?? ""}>
              <option value="">全部分类</option>
              {SEARCH_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <label htmlFor="f-audience" className="text-muted-foreground mb-1 block text-xs">
              适用人群
            </label>
            <Select id="f-audience" name="audience" defaultValue={audience ?? ""}>
              <option value="">全部人群</option>
              {AUDIENCES.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <label htmlFor="f-age" className="text-muted-foreground mb-1 block text-xs">
              年龄段
            </label>
            <Select id="f-age" name="ageGroup" defaultValue={ageGroup ?? ""}>
              <option value="">全部年龄</option>
              {AGE_GROUPS.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex items-end gap-2">
            <Button type="submit">筛选</Button>
            <Button asChild variant="ghost">
              <Link href="/search">清除筛选</Link>
            </Button>
          </div>
        </form>

        {result && (
          <p className="text-muted-foreground mt-6 text-sm" role="status">
            共找到 {result.total} 条结果
            {q && <>，关键词“{q}”</>}
          </p>
        )}

        {result && result.items.length === 0 && (
          <div className="border-border bg-card mt-10 rounded-lg border p-10 text-center">
            <p className="font-medium">没有找到相关内容</p>
            <p className="text-muted-foreground mt-2 text-sm">试试更换关键词或减少筛选条件。</p>
            <Button asChild variant="outline" className="mt-4">
              <Link href="/search">清除全部条件</Link>
            </Button>
          </div>
        )}

        {result && result.items.length > 0 && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {result.items.map((doc) => (
              <Card key={doc.url} className="flex h-full flex-col">
                <CardHeader className="pb-2">
                  <Badge className="w-fit">{doc.typeLabel}</Badge>
                  <CardTitle className="mt-1">
                    <Link href={doc.url} className="hover:text-primary hover:underline">
                      {doc.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col">
                  <p className="text-muted-foreground line-clamp-3 flex-1 text-sm">{doc.summary}</p>
                  <p className="text-muted-foreground mt-3 text-xs">
                    {doc.category} · {doc.ageGroups.join("、")}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {result && result.totalPages > 1 && (
          <nav aria-label="搜索结果分页" className="mt-8 flex items-center justify-center gap-2">
            {result.page > 1 && (
              <Button asChild variant="outline" size="sm">
                <Link href={pageHref(result.page - 1)}>上一页</Link>
              </Button>
            )}
            <span className="text-muted-foreground text-sm">
              第 {result.page} / {result.totalPages} 页
            </span>
            {result.page < result.totalPages && (
              <Button asChild variant="outline" size="sm">
                <Link href={pageHref(result.page + 1)}>下一页</Link>
              </Button>
            )}
          </nav>
        )}
      </div>
    </div>
  );
}
