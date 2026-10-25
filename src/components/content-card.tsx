import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

interface ContentCardProps {
  title: string;
  summary: string;
  href: string;
  category?: string;
  tags?: string[];
  date?: string;
  meta?: string;
}

export function ContentCard({
  title,
  summary,
  href,
  category,
  tags,
  date,
  meta,
}: ContentCardProps) {
  return (
    <Card className="flex h-full flex-col transition-shadow hover:shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-center gap-2">
          {category && <Badge>{category}</Badge>}
          {meta && <span className="text-muted-foreground text-xs">{meta}</span>}
        </div>
        <CardTitle className="mt-1">
          <Link href={href} className="hover:text-primary hover:underline">
            {title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        <p className="text-muted-foreground line-clamp-3 flex-1 text-sm">{summary}</p>
        <div className="text-muted-foreground mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
          {date && <time dateTime={date}>更新于 {formatDate(date)}</time>}
          {tags?.slice(0, 3).map((t) => (
            <span key={t} className="bg-muted rounded px-1.5 py-0.5">
              {t}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
