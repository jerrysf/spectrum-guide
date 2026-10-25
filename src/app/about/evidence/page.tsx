import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "循证与内容审核标准",
  description: "本站内容的来源标准、审核流程与发布规则。",
};

export default function EvidencePage() {
  return (
    <div>
      <PageHeader title="循证与内容审核标准" />
      <div className="mx-auto max-w-3xl space-y-8 px-4 py-10">
        <section>
          <h2 className="text-lg font-semibold">来源标准</h2>
          <p className="text-muted-foreground mt-2">
            医学与发展相关内容优先引用：同行评审的系统综述与研究、权威机构指南 （如美国儿科学会
            AAP、美国疾控中心 CDC、英国 NICE、世界卫生组织 WHO）、
            以及经同行评议的专业教材。我们区分三类信息：
          </p>
          <ul className="text-muted-foreground mt-2 list-disc space-y-1 pl-6">
            <li>
              <strong>已有较好证据</strong>：有高质量研究或指南支持。
            </li>
            <li>
              <strong>实践中常用</strong>：专业实践中广泛使用，但证据质量有限。
            </li>
            <li>
              <strong>尚不确定</strong>：证据不足或存在争议，我们会明确标注不确定性。
            </li>
          </ul>
        </section>
        <section>
          <h2 className="text-lg font-semibold">审核流程</h2>
          <ol className="text-muted-foreground mt-2 list-decimal space-y-1 pl-6">
            <li>草稿（draft）：内容撰写中，不对外公开。</li>
            <li>待审核（needs_review）：完成初稿，等待事实与来源核查。</li>
            <li>已审核（reviewed）：完成来源核查与内部编辑审核。</li>
            <li>已发布（published）：符合发布条件，对外可见。</li>
          </ol>
          <p className="text-muted-foreground mt-2">
            每篇文章标注更新时间、审核状态与审核角色。当前内容由编辑团队整理，
            标注为“编辑整理，待专业审核”的文章表示尚未经医生或持证专业人员审核，
            我们不会对这一点做夸大表述。
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold">我们不会做的事</h2>
          <ul className="text-muted-foreground mt-2 list-disc space-y-1 pl-6">
            <li>不宣称“治愈”自闭症，不推荐缺乏可靠证据的疗法。</li>
            <li>不伪造文献、机构背书、医生审核或不存在的来源链接。</li>
            <li>不编造国内政策、医院信息、医保待遇或诊疗流程。</li>
            <li>不复制未经授权的标准化量表全文，不自行发明诊断阈值。</li>
          </ul>
        </section>
        <section>
          <h2 className="text-lg font-semibold">纠错机制</h2>
          <p className="text-muted-foreground mt-2">
            每篇文章底部都有“内容纠错”入口。收到反馈后我们会核实来源，
            修正内容并更新“更新时间”。重大修改会在正文中说明。
          </p>
        </section>
      </div>
    </div>
  );
}
