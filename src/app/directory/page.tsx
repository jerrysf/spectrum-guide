import type { Metadata } from "next";
import { Building2, MessageSquare } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "机构名录与社区（筹备中）",
  description: "医院、康复机构与专业服务目录，以及家长与专业人员问答社区，正在筹备中。",
};

export default function DirectoryPage() {
  return (
    <div>
      <PageHeader title="机构名录与社区" />
      <div className="mx-auto max-w-4xl space-y-6 px-4 py-8">
        <section className="border-border bg-card rounded-xl border p-6">
          <div className="flex items-center gap-3">
            <Building2 className="text-primary h-7 w-7" aria-hidden="true" />
            <h2 className="text-lg font-semibold">
              机构与专业服务目录 <Badge variant="amber">筹备中</Badge>
            </h2>
          </div>
          <p className="text-muted-foreground mt-3 text-sm">
            我们正在设计一个可核实的机构目录。为了不让未经核实的信息误导家庭，
            上线前需要完成以下机制，因此当前不展示任何机构条目：
          </p>
          <ul className="text-muted-foreground mt-3 list-disc space-y-1 pl-6 text-sm">
            <li>医院、康复机构、专业服务人员的分类与省市筛选。</li>
            <li>信息来源、核实状态与更新时间的明确标注。</li>
            <li>纠错与撤下申请通道。</li>
            <li>清楚区分“平台核实信息”与“机构自行提交的信息”。</li>
          </ul>
          <p className="text-muted-foreground mt-3 text-sm">
            在功能上线前，如需就医或评估，请优先咨询当地儿童医院的发育行为科、儿童保健科或精神心理科。
          </p>
        </section>

        <section id="community" className="border-border bg-card rounded-xl border p-6">
          <div className="flex items-center gap-3">
            <MessageSquare className="text-primary h-7 w-7" aria-hidden="true" />
            <h2 className="text-lg font-semibold">
              问答社区 <Badge variant="amber">筹备中</Badge>
            </h2>
          </div>
          <p className="text-muted-foreground mt-3 text-sm">
            社区上线前需要完成：用户认证与权限控制、内容审核与举报反垃圾机制、
            儿童个人信息保护规则、医疗建议边界、数据保留与删除流程。
            在这些问题解决之前，我们不会以任何形式上线“看起来能用”的假社区。
          </p>
        </section>
      </div>
    </div>
  );
}
