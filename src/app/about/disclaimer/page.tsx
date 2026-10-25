import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "免责声明",
  description: "本站内容的用途与边界。",
};

export default function DisclaimerPage() {
  return (
    <div>
      <PageHeader title="免责声明" description="最后更新：2026-10-25" />
      <div className="mx-auto max-w-3xl space-y-8 px-4 py-10">
        <section>
          <h2 className="text-lg font-semibold">内容用途</h2>
          <p className="text-muted-foreground mt-2">
            本站所有内容仅供教育与一般参考，帮助家长、教师和相关人员更好地理解自闭症
            与常见支持方法。内容不构成医疗建议、心理建议、诊断或治疗方案。
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold">关于诊断与量表</h2>
          <ul className="text-muted-foreground mt-2 list-disc space-y-1 pl-6">
            <li>自闭症的诊断只能由具备资质的医疗专业人员按相应诊断标准做出。</li>
            <li>本站的“发展能力观察”是教育观察工具，不是诊断量表，其结果不构成任何医学结论。</li>
            <li>本站不对外提供标准化筛查量表的在线计分或诊断阈值判断。</li>
          </ul>
        </section>
        <section>
          <h2 className="text-lg font-semibold">关于干预建议</h2>
          <p className="text-muted-foreground mt-2">
            课程与资源描述的是一般性、常用的教育支持方法。每个孩子的需求不同，
            同一方法不一定适用于所有孩子。涉及自伤、攻击、严重进食困难等可能存在风险的行为时，
            请寻求个体化专业评估，不要仅依赖通用教程。
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold">紧急情况</h2>
          <p className="text-muted-foreground mt-2">
            本站不是急救或危机干预服务。如发生危及生命安全的情况，
            请立即联系当地急救服务（中国大陆：急救 120，报警 110）。
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold">外部链接</h2>
          <p className="text-muted-foreground mt-2">
            本站可能包含指向第三方网站或文献的链接，仅用于标注来源与延伸阅读。
            链接目标内容由各网站自行负责，不代表本站立场。
          </p>
        </section>
      </div>
    </div>
  );
}
