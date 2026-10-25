import { ExternalLink } from "lucide-react";
import type { Source } from "@/schemas/content";

const TYPE_LABELS: Record<Source["type"], string> = {
  guideline: "指南",
  systematic_review: "系统综述",
  research: "研究",
  book: "书籍/手册",
  official_page: "官方页面",
  manual: "手册",
};

export function SourcesList({ sources }: { sources: Source[] }) {
  if (sources.length === 0) return null;
  return (
    <section aria-labelledby="sources-heading" className="border-border mt-10 border-t pt-6">
      <h2 id="sources-heading" className="text-base font-semibold">
        参考来源
      </h2>
      <ol className="text-muted-foreground mt-3 space-y-2 text-sm">
        {sources.map((s, i) => (
          <li key={i} className="flex flex-wrap items-baseline gap-x-2">
            <span className="text-foreground/50">[{i + 1}]</span>
            <span>
              {s.author}
              {s.year ? `（${s.year}）` : ""}。《{s.title}》
              <span className="bg-muted ml-1 rounded px-1.5 py-0.5 text-xs">
                {TYPE_LABELS[s.type]}
              </span>
            </span>
            {s.url && (
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary inline-flex items-center gap-0.5 hover:underline"
              >
                查看来源
                <ExternalLink className="h-3 w-3" aria-hidden="true" />
              </a>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
