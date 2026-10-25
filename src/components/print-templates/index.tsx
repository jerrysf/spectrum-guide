import type { ResourceMeta } from "@/schemas/content";
import type { PrintTemplateId } from "@/lib/print-templates";

type Data = ResourceMeta["templateData"];

function Field({ label, wide }: { label: string; wide?: boolean }) {
  return (
    <div className={wide ? "col-span-2" : ""}>
      <p className="text-xs text-neutral-500">{label}</p>
      <div className="mt-1 h-8 border-b border-neutral-400" />
    </div>
  );
}

function PictureBox({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex h-24 w-full items-center justify-center border border-neutral-300 bg-neutral-50 text-xs text-neutral-400">
        贴上图片
      </div>
      <p className="mt-1 border-t-2 border-neutral-700 px-2 pt-1 text-sm font-medium">{label}</p>
    </div>
  );
}

function VisualSchedule({ data }: { data: Data }) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {data.items.map((item) => (
        <PictureBox key={item} label={item} />
      ))}
    </div>
  );
}

function CommunicationCards({ data }: { data: Data }) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {data.items.map((item) => (
        <div key={item} className="border-2 border-dashed border-neutral-400 p-2">
          <div className="flex h-20 items-center justify-center bg-neutral-50 text-xs text-neutral-400">
            贴上图片
          </div>
          <p className="mt-2 text-center text-sm font-semibold">{item}</p>
        </div>
      ))}
    </div>
  );
}

function SocialStory({ data }: { data: Data }) {
  return (
    <div className="space-y-5">
      {data.items.map((sentence, i) => (
        <div key={i} className="flex items-start gap-4 border border-neutral-300 p-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center border border-dashed border-neutral-400 text-xs text-neutral-400">
            图片
          </div>
          <p className="text-base leading-7">{sentence}</p>
        </div>
      ))}
    </div>
  );
}

function SelfCareSteps({ data }: { data: Data }) {
  return (
    <ol className="grid grid-cols-3 gap-4">
      {data.items.map((step, i) => (
        <li key={i} className="border border-neutral-300">
          <div className="flex h-20 items-center justify-center bg-neutral-50 text-xs text-neutral-400">
            贴上图片
          </div>
          <p className="border-t border-neutral-300 p-2 text-sm">
            <span className="mr-1 font-bold">{i + 1}.</span>
            {step}
          </p>
        </li>
      ))}
    </ol>
  );
}

function AbcObservation({ data }: { data: Data }) {
  const rows = data.rows ?? 8;
  const cols =
    data.columns.length > 0
      ? data.columns
      : ["日期/时间", "前因（A）", "行为（B）", "结果（C）", "备注"];
  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr>
          {cols.map((c) => (
            <th key={c} className="border border-neutral-400 bg-neutral-100 p-2 text-left">
              {c}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, i) => (
          <tr key={i}>
            {cols.map((c) => (
              <td key={c} className="h-12 border border-neutral-400 p-2" />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function TeachingRecord({ data }: { data: Data }) {
  const rows = data.rows ?? 10;
  const cols =
    data.columns.length > 0
      ? data.columns
      : ["日期", "教学目标", "使用提示", "完成次数", "正确率", "备注"];
  return <AbcObservation data={{ ...data, rows, columns: cols }} />;
}

function DailyLog({ data }: { data: Data }) {
  const rows = data.rows ?? 10;
  const cols =
    data.columns.length > 0
      ? data.columns
      : ["日期", "睡眠", "进食", "情绪", "值得记录的事", "用药/备注"];
  return <AbcObservation data={{ ...data, rows, columns: cols }} />;
}

function HomeSchoolNote({ data }: { data: Data }) {
  const fields =
    data.items.length > 0
      ? data.items
      : ["本周在家表现", "本周在校表现", "需要配合的事", "其他备注"];
  return (
    <div className="grid grid-cols-2 gap-6">
      <section>
        <h3 className="border-b-2 border-neutral-700 pb-1 font-semibold">家长填写</h3>
        <div className="mt-4 space-y-5">
          {fields.slice(0, Math.ceil(fields.length / 2)).map((f) => (
            <div key={f}>
              <p className="text-sm">{f}</p>
              <div className="mt-1 h-16 border border-neutral-300" />
            </div>
          ))}
        </div>
      </section>
      <section>
        <h3 className="border-b-2 border-neutral-700 pb-1 font-semibold">老师填写</h3>
        <div className="mt-4 space-y-5">
          {fields.slice(Math.ceil(fields.length / 2)).map((f) => (
            <div key={f}>
              <p className="text-sm">{f}</p>
              <div className="mt-1 h-16 border border-neutral-300" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

const TEMPLATES: Record<PrintTemplateId, (props: { data: Data }) => React.JSX.Element> = {
  "visual-schedule": VisualSchedule,
  "communication-cards": CommunicationCards,
  "social-story": SocialStory,
  "self-care-steps": SelfCareSteps,
  "abc-observation": AbcObservation,
  "teaching-record": TeachingRecord,
  "daily-log": DailyLog,
  "home-school-note": HomeSchoolNote,
};

export function PrintTemplate({ meta }: { meta: ResourceMeta }) {
  const Template = TEMPLATES[meta.template as PrintTemplateId];
  const data = meta.templateData;
  return (
    <div className="mx-auto max-w-3xl bg-white p-8 text-neutral-800 print:p-0">
      <header className="border-b-2 border-neutral-800 pb-4">
        <h1 className="text-2xl font-bold">{data.title ?? meta.title}</h1>
        <div className="mt-3 grid grid-cols-2 gap-6">
          <Field label="孩子昵称（可用代号）" />
          <Field label="日期" />
        </div>
      </header>
      {data.instructions.length > 0 && (
        <div className="mt-4 rounded border border-neutral-300 bg-neutral-50 p-3 text-sm print:bg-white">
          <p className="font-semibold">使用说明</p>
          <ul className="mt-1 list-disc pl-5">
            {data.instructions.map((ins) => (
              <li key={ins}>{ins}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="mt-6">{Template ? <Template data={data} /> : <p>模板不存在</p>}</div>
      <footer className="mt-8 border-t border-neutral-300 pt-3 text-xs text-neutral-500">
        <p>
          {meta.title} · 星伴成长 Spectrum Guide · {meta.license} · 更新于 {meta.lastUpdated}
        </p>
        <p className="mt-1">本模板用于教育与家庭支持记录，不构成医疗文件。</p>
      </footer>
    </div>
  );
}
