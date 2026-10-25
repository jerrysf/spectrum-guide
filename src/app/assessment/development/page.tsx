import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { ObservationWizard } from "@/components/observation/wizard";

export const metadata: Metadata = {
  title: "发展能力观察",
  description:
    "非诊断性的发展能力观察工具：记录孩子在沟通、社交、模仿、游戏、自理、情绪调节等日常领域的表现，生成分领域摘要。数据只保存在你的浏览器中。",
};

export default function DevelopmentAssessmentPage() {
  return (
    <div>
      <PageHeader
        title="发展能力观察"
        description="通过具体情境条目记录孩子最近几周的表现，生成分领域观察摘要。这不是诊断工具，回答只保存在你的浏览器中。"
      />
      <div className="mx-auto max-w-6xl px-4 py-10">
        <ObservationWizard />
      </div>
    </div>
  );
}
