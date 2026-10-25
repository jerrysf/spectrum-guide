import type { TocItem } from "@/lib/mdx";

export function ArticleToc({ items }: { items: TocItem[] }) {
  if (items.length < 2) return null;
  return (
    <nav aria-label="文章目录" className="border-border bg-muted/40 rounded-lg border p-4 text-sm">
      <p className="font-semibold">本文目录</p>
      <ul className="mt-2 space-y-1.5">
        {items.map((item) => (
          <li key={item.id} className={item.depth === 3 ? "pl-4" : ""}>
            <a href={`#${item.id}`} className="text-muted-foreground hover:text-primary">
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
