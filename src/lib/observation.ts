import {
  OBSERVATION_DOMAINS,
  ANSWER_OPTIONS,
  type AnswerValue,
  type ObservationDomain,
} from "@/data/observation-domains";

export type ObservationAnswers = Record<string, AnswerValue>;

export interface DomainResult {
  domain: ObservationDomain;
  observed: string[]; // 经常/有时观察到的条目
  notYet: string[]; // 暂未观察到
  unclear: string[]; // 尚不确定
  notApplicable: number;
  answered: number;
  total: number;
}

export interface ObservationResult {
  domains: DomainResult[];
  totalAnswered: number;
  totalItems: number;
  completed: boolean;
  generatedAt: string;
}

export const VALID_ANSWERS = new Set<string>(ANSWER_OPTIONS.map((o) => o.value));

export function isAnswerValue(v: unknown): v is AnswerValue {
  return typeof v === "string" && VALID_ANSWERS.has(v);
}

/** 过滤非法/不存在的回答，只保留题库内的合法条目 */
export function sanitizeAnswers(raw: unknown): ObservationAnswers {
  if (typeof raw !== "object" || raw === null) return {};
  const validIds = new Set(OBSERVATION_DOMAINS.flatMap((d) => d.items.map((i) => i.id)));
  const out: ObservationAnswers = {};
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    if (validIds.has(k) && isAnswerValue(v)) out[k] = v;
  }
  return out;
}

export function generateResult(answers: ObservationAnswers, now = new Date()): ObservationResult {
  const domains: DomainResult[] = OBSERVATION_DOMAINS.map((domain) => {
    const observed: string[] = [];
    const notYet: string[] = [];
    const unclear: string[] = [];
    let notApplicable = 0;

    for (const item of domain.items) {
      const a = answers[item.id];
      if (a === "often" || a === "sometimes") observed.push(item.text);
      else if (a === "not_yet") notYet.push(item.text);
      else if (a === "unsure") unclear.push(item.text);
      else if (a === "na") notApplicable += 1;
    }

    const answered = domain.items.filter((i) => i.id in answers).length;
    return {
      domain,
      observed,
      notYet,
      unclear,
      notApplicable,
      answered,
      total: domain.items.length,
    };
  });

  const totalItems = OBSERVATION_DOMAINS.reduce((n, d) => n + d.items.length, 0);
  const totalAnswered = domains.reduce((n, d) => n + d.answered, 0);

  return {
    domains,
    totalAnswered,
    totalItems,
    completed: totalAnswered === totalItems,
    generatedAt: now.toISOString(),
  };
}

/** 生成给家庭的一般性支持建议（非诊断、非医嘱） */
export function buildSupportSummary(result: ObservationResult): string[] {
  const suggestions: string[] = [];
  for (const d of result.domains) {
    if (d.answered === 0) continue;
    if (d.notYet.length >= Math.ceil(d.total / 2)) {
      suggestions.push(
        `「${d.domain.name}」领域有较多条目暂未观察到，建议在日常生活中继续记录，并可向发育行为科、言语治疗师或特教老师咨询该领域的支持方式。`,
      );
    } else if (d.unclear.length > 0) {
      suggestions.push(
        `「${d.domain.name}」领域有 ${d.unclear.length} 条尚不确定，可在下一周针对这些情境重点观察记录。`,
      );
    }
  }
  if (suggestions.length === 0 && result.completed) {
    suggestions.push("各领域的多数条目均有观察到。继续按孩子当下的能力制定日常支持计划即可。");
  }
  return suggestions;
}
