import Link from "next/link";
import type { Metadata } from "next";
import { Flag } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/utils";

export const metadata: Metadata = {
  title: "关于我们",
  description: `${SITE_NAME}是一个面向中国大陆自闭症儿童家庭与专业人员的循证知识与实操平台。`,
};

export default function AboutPage() {
  return (
    <div>
      <PageHeader title={`关于${SITE_NAME}`} />
      <div className="mx-auto max-w-3xl space-y-8 px-4 py-10">
        <section>
          <h2 className="text-lg font-semibold">我们在做什么</h2>
          <p className="text-muted-foreground mt-2">
            {SITE_NAME}（Spectrum Guide）是一个面向自闭症儿童家长、特殊教育教师和康复师的
            循证知识与实操平台。我们把可靠的研究结论和实践经验，翻译成可以在家庭和课堂中
            直接使用的语言与工具。
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold">我们相信</h2>
          <ul className="text-muted-foreground mt-2 list-disc space-y-1 pl-6">
            <li>自闭症是一种神经发展差异，不是需要被“治愈”的疾病。</li>
            <li>每个孩子的能力、兴趣和需求都不同，支持应当个体化。</li>
            <li>家长和老师是孩子最重要的支持者，他们需要可信赖、可操作的信息。</li>
            <li>隐私保护优先：不收集不必要的个人信息，尤其是儿童敏感信息。</li>
          </ul>
        </section>
        <section id="corrections">
          <h2 className="text-lg font-semibold">内容纠错与联系</h2>
          <p className="text-muted-foreground mt-2">
            如果你发现内容有误、链接失效或来源存疑，欢迎写信告诉我们。我们会在核实后修改，
            并更新文章的“更新时间”。
          </p>
          <p className="mt-3">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-primary inline-flex items-center gap-1.5 hover:underline"
            >
              <Flag className="h-4 w-4" aria-hidden="true" />
              {CONTACT_EMAIL}
            </a>
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold">相关文档</h2>
          <ul className="text-primary mt-2 space-y-1">
            <li>
              <Link href="/about/evidence" className="hover:underline">
                循证与内容审核标准
              </Link>
            </li>
            <li>
              <Link href="/about/privacy" className="hover:underline">
                隐私政策
              </Link>
            </li>
            <li>
              <Link href="/about/disclaimer" className="hover:underline">
                免责声明
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
