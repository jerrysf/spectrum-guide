import { expect, test } from "@playwright/test";

test.describe("核心导航与内容", () => {
  test("首页加载并展示主要入口", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("理解孩子");
    await expect(page.getByRole("link", { name: "认识自闭症" })).toBeVisible();
    await expect(page.getByRole("link", { name: "观察发展能力" })).toBeVisible();
    await expect(page.getByRole("link", { name: "查找教学资源" })).toBeVisible();
  });

  test("从首页打开科普列表并进入文章详情", async ({ page }) => {
    await page.goto("/");
    await page
      .getByRole("navigation", { name: "主导航" })
      .getByRole("link", { name: "科普知识" })
      .click();
    await expect(page).toHaveURL(/\/knowledge$/);
    await expect(page.getByRole("heading", { name: "科普知识" })).toBeVisible();

    await page.getByRole("link", { name: "什么是自闭症谱系障碍" }).first().click();
    await expect(page).toHaveURL(/\/knowledge\/what-is-autism/);
    await expect(page.getByRole("heading", { name: "什么是自闭症谱系障碍" })).toBeVisible();
    // 参考来源存在
    await expect(page.getByRole("heading", { name: "参考来源" })).toBeVisible();
    // 目录
    await expect(page.getByRole("navigation", { name: "文章目录" }).first()).toBeVisible();
  });

  test("知识列表分类筛选", async ({ page }) => {
    await page.goto("/knowledge?category=感官特点");
    const current = page.locator('[aria-current="true"]').filter({ hasText: "感官特点" });
    await expect(current).toBeVisible();
    await expect(page.getByRole("link", { name: "如何理解感官敏感与感官寻求" })).toBeVisible();
  });

  test("课程列表按主题筛选", async ({ page }) => {
    await page.goto("/courses");
    await page.getByRole("link", { name: "视觉日程", exact: true }).click();
    await expect(page).toHaveURL(/tag=/);
    await expect(page.getByRole("link", { name: "视觉日程与活动转换" })).toBeVisible();
    // 其他主题课程不出现
    await expect(page.getByRole("link", { name: "功能性沟通与表达需求" })).not.toBeVisible();
  });

  test("搜索并打开文章", async ({ page }) => {
    await page.goto("/search?q=睡眠");
    await expect(page.getByRole("link", { name: "自闭症儿童睡眠问题" })).toBeVisible();
    await page.getByRole("link", { name: "自闭症儿童睡眠问题" }).click();
    await expect(page).toHaveURL(/\/knowledge\/sleep-problems/);
  });

  test("搜索筛选与无结果状态", async ({ page }) => {
    await page.goto("/search?q=洗手&type=course");
    await expect(page.getByRole("link", { name: "日常生活自理" })).toBeVisible();

    await page.goto("/search?q=完全不存在的内容xyz123");
    await expect(page.getByText("没有找到相关内容")).toBeVisible();
  });

  test("安全指南入口与页面", async ({ page }) => {
    await page.goto("/safety");
    await expect(page.getByRole("link", { name: /自伤行为安全指南/ })).toBeVisible();
    await page.getByRole("link", { name: /自伤行为安全指南/ }).click();
    await expect(page).toHaveURL(/\/safety\/self-injury/);
    await expect(page.getByText(/拨打当地急救电话/).first()).toBeVisible();
  });

  test("资源详情可打开打印模板", async ({ page }) => {
    await page.goto("/resources/visual-schedule-daily");
    await page.getByRole("link", { name: "打开打印模板" }).click();
    await expect(page).toHaveURL(/\/resources\/visual-schedule-daily\/print/);
    await expect(page.getByRole("button", { name: /打印/ })).toBeVisible();
    await expect(page.getByRole("heading", { name: "一日流程视觉日程" })).toBeVisible();
  });

  test("不存在的 slug 返回 404", async ({ page }) => {
    const resp = await page.goto("/knowledge/not-exist-article");
    expect(resp?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: "页面不存在" })).toBeVisible();
  });

  test("页脚与导航链接有效", async ({ page }) => {
    await page.goto("/");
    const links = page.locator("header a[href^='/'], footer a[href^='/']");
    const hrefs = await links.evaluateAll((els) =>
      [...new Set(els.map((e) => e.getAttribute("href") ?? ""))].filter(
        (h) => h && !h.includes("#"),
      ),
    );
    for (const href of hrefs) {
      const resp = await page.request.get(href);
      expect(resp.status(), `${href} 应返回 200`).toBe(200);
    }
  });
});
