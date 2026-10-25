import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "隐私政策",
  description: "本站如何（以及如何不）处理你的数据。",
};

export default function PrivacyPage() {
  return (
    <div>
      <PageHeader title="隐私政策" description="最后更新：2026-10-25" />
      <div className="mx-auto max-w-3xl space-y-8 px-4 py-10">
        <section>
          <h2 className="text-lg font-semibold">我们收集什么</h2>
          <p className="text-muted-foreground mt-2">
            当前版本为静态内容网站，不设置账号系统，不向服务器提交表单，不接入第三方分析服务。
            因此，我们<strong className="text-foreground">不主动收集</strong>你的个人信息。
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold">发展能力观察数据</h2>
          <ul className="text-muted-foreground mt-2 list-disc space-y-1 pl-6">
            <li>你的回答默认只保存在当前浏览器的内存中，离开页面即消失。</li>
            <li>
              只有当你勾选“保存在此浏览器”时，回答才写入本机 localStorage；
              该数据不会发送到我们的服务器或任何第三方。
            </li>
            <li>结果页提供“清除已保存数据”操作；清除浏览器站点数据也会删除保存内容。</li>
            <li>观察回答不会出现在网址、分享链接或错误日志中。</li>
          </ul>
        </section>
        <section>
          <h2 className="text-lg font-semibold">儿童信息</h2>
          <p className="text-muted-foreground mt-2">
            请不要在本站任何输入框中填写儿童的真实姓名、身份证号、学校名称、精确住址、
            面部照片或其他可识别信息。模板上的姓名栏建议使用昵称或代号。
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold">未来功能的数据原则</h2>
          <p className="text-muted-foreground mt-2">
            若未来上线账号、观察历史或社区功能，我们将：默认最小化收集、提供数据导出与删除、
            对儿童相关信息做额外保护评估，并在功能上线前更新本政策。届时如使用第三方服务
            （如托管数据库），我们会明确列出并说明其数据处理角色。
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold">你的选择</h2>
          <ul className="text-muted-foreground mt-2 list-disc space-y-1 pl-6">
            <li>不勾选“保存在此浏览器”——回答不会被持久化。</li>
            <li>在结果页点击“清除已保存数据”，或在浏览器设置中清除本站数据。</li>
          </ul>
        </section>
        <p className="border-border bg-muted/50 text-muted-foreground rounded-md border p-4 text-xs">
          本政策为当前版本的说明性文本，不构成法律意见。正式上线前的法律合规复核见项目文档中的上线检查清单。
        </p>
      </div>
    </div>
  );
}
