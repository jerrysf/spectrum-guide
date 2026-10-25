import { describe, expect, it } from "vitest";
import { OBSERVATION_DOMAINS } from "@/data/observation-domains";
import {
  buildSupportSummary,
  generateResult,
  isAnswerValue,
  sanitizeAnswers,
  type ObservationAnswers,
} from "@/lib/observation";

const asAnswers = (r: Record<string, string>) => r as ObservationAnswers;

const allItems = OBSERVATION_DOMAINS.flatMap((d) => d.items);

describe("answer 校验", () => {
  it("合法值通过", () => {
    for (const v of ["often", "sometimes", "not_yet", "unsure", "na"]) {
      expect(isAnswerValue(v)).toBe(true);
    }
  });
  it("非法值拒绝", () => {
    for (const v of ["yes", "", 1, null, "OFTEN"]) {
      expect(isAnswerValue(v)).toBe(false);
    }
  });
});

describe("sanitizeAnswers", () => {
  it("过滤不存在的条目与非法答案", () => {
    const clean = sanitizeAnswers({
      "comm-1": "often",
      "fake-id": "often",
      "comm-2": "evil-value",
    });
    expect(clean).toEqual({ "comm-1": "often" });
  });
  it("非对象输入返回空", () => {
    expect(sanitizeAnswers("string")).toEqual({});
    expect(sanitizeAnswers(null)).toEqual({});
    expect(sanitizeAnswers(42)).toEqual({});
  });
});

describe("generateResult", () => {
  it("空答案：全部未答，completed=false", () => {
    const r = generateResult({});
    expect(r.completed).toBe(false);
    expect(r.totalAnswered).toBe(0);
    expect(r.domains).toHaveLength(OBSERVATION_DOMAINS.length);
  });

  it("全部作答：completed=true，分类正确", () => {
    const answers = asAnswers(
      Object.fromEntries(
        allItems.map((item, i) => [
          item.id,
          i % 4 === 0 ? "often" : i % 4 === 1 ? "not_yet" : i % 4 === 2 ? "unsure" : "na",
        ]),
      ),
    );
    const r = generateResult(answers);
    expect(r.completed).toBe(true);
    const d0 = r.domains[0];
    expect(d0.observed.length + d0.notYet.length + d0.unclear.length + d0.notApplicable).toBe(
      d0.total,
    );
  });

  it("结果不含任何评分/诊断字段", () => {
    const answers = asAnswers(Object.fromEntries(allItems.map((i) => [i.id, "often"])));
    const r = generateResult(answers);
    const json = JSON.stringify(r);
    expect(json).not.toMatch(/score|risk|diagnos/i);
  });
});

describe("buildSupportSummary", () => {
  it("某领域多数未观察到时给出咨询建议", () => {
    const answers: Record<string, "not_yet"> = {};
    for (const item of OBSERVATION_DOMAINS[0].items) answers[item.id] = "not_yet";
    const r = generateResult(answers);
    const s = buildSupportSummary(r);
    expect(s.some((x) => x.includes(OBSERVATION_DOMAINS[0].name))).toBe(true);
  });

  it("全部完成且无问题模式时给出正面建议", () => {
    const answers = asAnswers(Object.fromEntries(allItems.map((i) => [i.id, "often"])));
    const s = buildSupportSummary(generateResult(answers));
    expect(s.length).toBeGreaterThan(0);
  });

  it("未答领域不产生建议", () => {
    const s = buildSupportSummary(generateResult({}));
    expect(s).toEqual([]);
  });
});
