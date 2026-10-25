import { Badge } from "@/components/ui/badge";
import type { ReviewStatus } from "@/schemas/content";

const STATUS_LABELS: Record<ReviewStatus, string> = {
  draft: "草稿",
  needs_review: "待审核",
  reviewed: "已审核",
  published: "已发布",
};

export function ReviewBadge({ status, role }: { status: ReviewStatus; role: string }) {
  return (
    <span className="text-muted-foreground inline-flex flex-wrap items-center gap-2 text-sm">
      <Badge variant="secondary">{STATUS_LABELS[status]}</Badge>
      <span>{role}</span>
    </span>
  );
}
