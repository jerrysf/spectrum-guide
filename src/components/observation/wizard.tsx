"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Printer, RotateCcw, Trash2 } from "lucide-react";
import { ANSWER_OPTIONS, OBSERVATION_DOMAINS } from "@/data/observation-domains";
import {
  buildSupportSummary,
  generateResult,
  isAnswerValue,
  sanitizeAnswers,
  type ObservationAnswers,
} from "@/lib/observation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const STORAGE_KEY = "sg-observation-v1";

type Stage = "intro" | number | "result";

export function ObservationWizard() {
  const [stage, setStage] = React.useState<Stage>("intro");
  const [answers, setAnswers] = React.useState<ObservationAnswers>({});
  const [persist, setPersist] = React.useState(false);
  const [hasSaved, setHasSaved] = React.useState(false);

  // 恢复已保存数据（挂载时一次性读取 localStorage，必须发生在客户端水合之后）
  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { answers?: unknown; savedAt?: string };
        const clean = sanitizeAnswers(parsed.answers);
        if (Object.keys(clean).length > 0) {
          /* eslint-disable react-hooks/set-state-in-effect -- 仅挂载时恢复一次持久化数据 */
          setAnswers(clean);
          setPersist(true);
          setHasSaved(true);
          /* eslint-enable react-hooks/set-state-in-effect */
        }
      }
    } catch {
      // localStorage 不可用或数据损坏时忽略
    }
  }, []);

  // 仅在用户选择保存时写入 localStorage
  React.useEffect(() => {
    try {
      if (persist) {
        window.localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ answers, savedAt: new Date().toISOString() }),
        );
      } else {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // 忽略存储失败
    }
  }, [answers, persist]);

  const totalItems = OBSERVATION_DOMAINS.reduce((n, d) => n + d.items.length, 0);
  const answeredCount = Object.keys(answers).length;
  const progress = Math.round((answeredCount / totalItems) * 100);

  function setAnswer(itemId: string, value: string) {
    if (!isAnswerValue(value)) return;
    setAnswers((prev) => ({ ...prev, [itemId]: value }));
  }

  function clearSaved() {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setAnswers({});
    setPersist(false);
    setHasSaved(false);
    setStage("intro");
  }

  function next() {
    if (stage === "intro") setStage(0);
    else if (typeof stage === "number") {
      if (stage < OBSERVATION_DOMAINS.length - 1) setStage(stage + 1);
      else setStage("result");
    }
    window.scrollTo({ top: 0 });
  }

  function prev() {
    if (stage === 0) setStage("intro");
    else if (typeof stage === "number") setStage(stage - 1);
    window.scrollTo({ top: 0 });
  }

  if (stage === "intro") {
    return (
      <div className="border-border bg-card mx-auto max-w-2xl rounded-xl border p-6 sm:p-8">
        <h2 className="text-xl font-bold">开始之前</h2>
        <ul className="text-muted-foreground mt-4 list-disc space-y-2 pl-6 text-sm">
          <li>
            这是一个<strong className="text-foreground">发展能力观察工具</strong>
            ，用于记录孩子在日常生活中的表现，不是诊断量表，不能判断孩子是否患有自闭症。
          </li>
          <li>请根据最近几周的日常观察作答。不确定的条目可以选“尚不确定”，之后可以再补记。</li>
          <li>
            观察结果不构成医学结论；如担心孩子的发展，建议携带结果咨询发育行为科或相关专业人员。
          </li>
          <li>
            回答仅在你的浏览器中处理。勾选下方选项后才会保存在本机，可随时清除；清除浏览器数据后保存内容会丢失。
          </li>
        </ul>
        <div className="mt-6 flex items-center gap-2">
          <Checkbox
            id="persist"
            checked={persist}
            onCheckedChange={(v) => setPersist(v === true)}
          />
          <Label htmlFor="persist" className="text-sm font-normal">
            把回答保存在此浏览器中（不会上传到服务器）
          </Label>
        </div>
        {hasSaved && (
          <p className="text-muted-foreground mt-3 text-sm" role="status">
            已恢复上次保存的 {answeredCount} 条回答。
          </p>
        )}
        <div className="mt-6 flex flex-wrap gap-3">
          <Button onClick={next}>开始观察</Button>
          {hasSaved && (
            <Button variant="outline" onClick={clearSaved}>
              <Trash2 aria-hidden="true" />
              清除已保存数据
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (stage === "result") {
    const result = generateResult(answers);
    const suggestions = buildSupportSummary(result);
    return (
      <div className="mx-auto max-w-3xl" data-testid="observation-result">
        <div className="border-border bg-card rounded-xl border p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold">观察摘要</h2>
              <p className="text-muted-foreground mt-1 text-sm">
                已完成 {result.totalAnswered}/{result.totalItems} 个条目 ·{" "}
                {result.completed ? "全部完成" : "部分完成"}
              </p>
            </div>
            <div className="no-print flex gap-2">
              <Button variant="outline" size="sm" onClick={() => window.print()}>
                <Printer aria-hidden="true" />
                打印结果
              </Button>
              <Button variant="outline" size="sm" onClick={() => setStage(0)}>
                <RotateCcw aria-hidden="true" />
                返回修改
              </Button>
            </div>
          </div>

          <p className="bg-muted/60 text-muted-foreground mt-4 rounded-md p-3 text-xs">
            这份摘要描述的是你在日常情境中观察到的孩子表现，用于家庭支持与就医、教学沟通，
            不是诊断结论，也不能替代专业评估。
          </p>

          <div className="mt-6 space-y-6">
            {result.domains.map((d) => (
              <section key={d.domain.id} className="border-border rounded-lg border p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-semibold">{d.domain.name}</h3>
                  <Badge variant="outline">
                    已答 {d.answered}/{d.total}
                  </Badge>
                </div>
                {d.observed.length > 0 && (
                  <div className="mt-3">
                    <p className="text-primary text-sm font-medium">已观察到的能力</p>
                    <ul className="text-muted-foreground mt-1 list-disc space-y-1 pl-5 text-sm">
                      {d.observed.map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {d.notYet.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium">暂未观察到</p>
                    <ul className="text-muted-foreground mt-1 list-disc space-y-1 pl-5 text-sm">
                      {d.notYet.map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {d.unclear.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium">尚不确定，可继续观察</p>
                    <ul className="text-muted-foreground mt-1 list-disc space-y-1 pl-5 text-sm">
                      {d.unclear.map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <p className="text-muted-foreground mt-3 text-xs">提示：{d.domain.tips[0]}</p>
              </section>
            ))}
          </div>

          <section className="border-border bg-primary-soft/40 mt-6 rounded-lg border p-4">
            <h3 className="font-semibold">家庭支持建议（一般性建议，非医嘱）</h3>
            <ul className="text-muted-foreground mt-2 list-disc space-y-1 pl-5 text-sm">
              {suggestions.map((s) => (
                <li key={s}>{s}</li>
              ))}
              <li>
                就诊准备：可携带本摘要、日常记录（睡眠、进食、情绪）和孩子日常活动的视频片段，
                帮助医生了解孩子在自然情境中的表现。
              </li>
              <li>
                如存在自伤、走失等安全风险，请先阅读
                <Link href="/safety" className="text-primary underline">
                  安全指南
                </Link>
                ，并尽快寻求个体化专业支持。
              </li>
            </ul>
          </section>

          <div className="no-print border-border mt-6 flex flex-wrap items-center gap-3 border-t pt-4">
            <div className="flex items-center gap-2">
              <Checkbox
                id="persist-result"
                checked={persist}
                onCheckedChange={(v) => setPersist(v === true)}
              />
              <Label htmlFor="persist-result" className="text-sm font-normal">
                保存在此浏览器
              </Label>
            </div>
            <Button variant="ghost" size="sm" onClick={clearSaved}>
              <Trash2 aria-hidden="true" />
              清除已保存数据
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // stage is a domain index
  const domain = OBSERVATION_DOMAINS[stage];
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="text-muted-foreground text-sm">
          领域 {stage + 1}/{OBSERVATION_DOMAINS.length}：{domain.name}
        </p>
        <p className="text-muted-foreground text-sm">整体进度 {progress}%</p>
      </div>
      <Progress value={progress} aria-label={`整体进度 ${progress}%`} />

      <div className="border-border bg-card mt-6 rounded-xl border p-6 sm:p-8">
        <h2 className="text-xl font-bold">{domain.name}</h2>
        <p className="text-muted-foreground mt-1 text-sm">{domain.description}</p>

        <div className="mt-6 space-y-8">
          {domain.items.map((item, idx) => (
            <fieldset key={item.id}>
              <legend className="text-base leading-7 font-medium">
                {idx + 1}. {item.text}
              </legend>
              <RadioGroup
                aria-label={item.text}
                value={answers[item.id] ?? ""}
                onValueChange={(v) => setAnswer(item.id, v)}
                className="mt-3 grid gap-2 sm:grid-cols-2"
              >
                {ANSWER_OPTIONS.map((opt) => (
                  <div
                    key={opt.value}
                    className="border-border has-checked:border-primary has-checked:bg-primary-soft/50 flex items-center gap-2 rounded-md border px-3 py-2"
                  >
                    <RadioGroupItem value={opt.value} id={`${item.id}-${opt.value}`} />
                    <Label
                      htmlFor={`${item.id}-${opt.value}`}
                      className="flex-1 cursor-pointer text-sm font-normal"
                    >
                      {opt.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </fieldset>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-between">
          <Button variant="outline" onClick={prev}>
            <ArrowLeft aria-hidden="true" />
            上一步
          </Button>
          <Button onClick={next}>
            {stage < OBSERVATION_DOMAINS.length - 1 ? "下一领域" : "查看观察摘要"}
            <ArrowRight aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  );
}
