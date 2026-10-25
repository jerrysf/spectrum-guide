import type { Metadata } from "next";
import { Lock } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "内容管理（预留）",
  robots: { index: false },
};

export default function AdminPage() {
  return (
    <div>
      <PageHeader title="内容管理" />
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <Lock className="text-muted-foreground mx-auto h-10 w-10" aria-hidden="true" />
        <Badge variant="amber" className="mt-4">
          预留入口 · 未开放
        </Badge>
        <p className="text-muted-foreground mt-4">
          本入口为后续内容管理系统预留。在完成身份认证与权限控制之前，
          此页面不提供任何真实管理能力。当前版本的内容通过仓库中的 MDX 文件维护，
          修改流程见项目文档。
        </p>
      </div>
    </div>
  );
}
