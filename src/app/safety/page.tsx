import Link from "next/link";
import type { Metadata } from "next";
import { AlertTriangle, ShieldAlert, Siren } from "lucide-react";
import { getSafetyGuides } from "@/lib/content";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "安全指南",
  description:
    "自伤、走失与情绪危机的现场安全措施：如何识别即时危险、减少环境风险、简短清楚地沟通，以及何时寻求紧急帮助。",
};

const SLUG_ICONS: Record<string, typeof ShieldAlert> = {
  "self-injury": ShieldAlert,
  elopement: AlertTriangle,
  "emotional-crisis": Siren,
};

export default function SafetyPage() {
  const guides = getSafetyGuides();

  return (
    <div>
      <PageHeader
        title="危险行为安全指南"
        description="当孩子出现自伤、走失倾向或情绪危机时，优先保护人身安全。以下指南帮助你判断危险程度、采取现场措施并知道何时求助。"
      />
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="bg-accent-amber/60 rounded-lg border border-amber-600/30 p-4 text-sm">
          <p className="font-semibold">紧急情况提示</p>
          <p className="text-muted-foreground mt-1">
            如果孩子正在发生严重自伤、冲到马路等危及生命的情况，或出现呼吸异常、意识改变，
            请立即拨打当地急救电话（中国大陆：120；报警：110），优先保护生命安全。
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {guides.map(({ meta }) => {
            const Icon = SLUG_ICONS[meta.slug] ?? ShieldAlert;
            return (
              <Link
                key={meta.slug}
                href={`/safety/${meta.slug}`}
                className="border-border bg-card hover:bg-muted rounded-lg border p-5 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <Icon className="text-primary h-6 w-6" aria-hidden="true" />
                  <Badge variant={meta.dangerLevel === "紧急" ? "amber" : "secondary"}>
                    {meta.dangerLevel}
                  </Badge>
                </div>
                <p className="mt-3 font-semibold">{meta.title}</p>
                <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">{meta.summary}</p>
                <p className="text-muted-foreground mt-3 text-xs">更新于 {meta.lastUpdated}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
