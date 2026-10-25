import Link from "next/link";
import type { Metadata } from "next";
import { ClipboardList, Info, Lock } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "评估工具",
  description:
    "发展能力观察工具：帮助家长和老师在日常情境中系统记录孩子的沟通、社交、模仿、游戏、自理与情绪调节表现。不是诊断量表。",
};

export default function AssessmentPage() {
  return (
    <div>
      <PageHeader
        title="评估与发展观察"
        description="这里的工具用于记录和整理孩子在日常生活中的能力表现，为家庭支持与就医准备提供参考。"
      />
      <div className="mx-auto max-w-4xl space-y-6 px-4 py-8">
        <Link
          href="/assessment/development"
          className="border-border bg-card block rounded-xl border p-6 transition-shadow hover:shadow-sm"
        >
          <div className="flex items-start gap-4">
            <ClipboardList className="text-primary mt-1 h-8 w-8 shrink-0" aria-hidden="true" />
            <div>
              <p className="text-lg font-semibold">发展能力观察</p>
              <p className="text-muted-foreground mt-1 text-sm">
                覆盖语言与功能性沟通、社交互动、模仿、游戏与兴趣、生活自理、情绪调节六个领域。
                完成后生成分领域观察摘要，可打印用于就诊或教学沟通。约需 5–10 分钟。
              </p>
              <Button className="mt-4" size="sm">
                开始观察
              </Button>
            </div>
          </div>
        </Link>

        <section className="border-border bg-card rounded-xl border p-6">
          <div className="flex items-center gap-2">
            <Info className="text-primary h-5 w-5" aria-hidden="true" />
            <h2 className="font-semibold">这个工具是什么，不是什么</h2>
          </div>
          <ul className="text-muted-foreground mt-3 list-disc space-y-1 pl-6 text-sm">
            <li>它是教育与发展能力观察工具，帮助你在日常情境中系统记录孩子的表现。</li>
            <li>它不是诊断量表，不用于判断孩子是否患有自闭症，也不产出医学风险评分。</li>
            <li>
              M-CHAT、ABC、CARS
              等标准化量表需要在符合授权与使用规则的前提下由专业人员施测，本站暂不提供在线计分。
            </li>
            <li>观察结果适合作为与医生、老师沟通时的参考材料。</li>
          </ul>
        </section>

        <section className="border-border bg-card rounded-xl border p-6">
          <div className="flex items-center gap-2">
            <Lock className="text-primary h-5 w-5" aria-hidden="true" />
            <h2 className="font-semibold">隐私说明</h2>
          </div>
          <ul className="text-muted-foreground mt-3 list-disc space-y-1 pl-6 text-sm">
            <li>回答只在你自己的浏览器中处理，不会发送到服务器或第三方。</li>
            <li>不需要填写孩子的真实姓名、学校、住址等信息。</li>
            <li>只有当你勾选“保存在此浏览器”时，回答才会存入本机 localStorage，且可随时清除。</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
