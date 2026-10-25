import { expect, test } from "@playwright/test";

test.describe("发展能力观察工具", () => {
  test("完整流程：开始 → 回答 → 查看摘要", async ({ page }) => {
    await page.goto("/assessment/development");
    await page.getByRole("button", { name: "开始观察" }).click();

    // 6 个领域，每个领域选择每个题目的第一个选项（"经常观察到"）
    for (let d = 0; d < 6; d++) {
      const groups = page.getByRole("radiogroup");
      const count = await groups.count();
      for (let i = 0; i < count; i++) {
        await groups.nth(i).getByRole("radio", { name: "经常观察到" }).click();
      }
      const nextBtn =
        d < 5
          ? page.getByRole("button", { name: "下一领域" })
          : page.getByRole("button", { name: "查看观察摘要" });
      await nextBtn.click();
    }

    await expect(page.getByTestId("observation-result")).toBeVisible();
    await expect(page.getByText(/已完成 \d+\/\d+ 个条目/)).toBeVisible();
    await expect(page.getByText("已观察到的能力").first()).toBeVisible();
    // 不是诊断结论
    await expect(page.getByText(/不是诊断结论/)).toBeVisible();
  });

  test("保存与清除本地数据", async ({ page }) => {
    await page.goto("/assessment/development");
    await page.getByLabel("把回答保存在此浏览器中").click();
    await page.getByRole("button", { name: "开始观察" }).click();

    const firstGroup = page.getByRole("radiogroup").first();
    await firstGroup.getByRole("radio", { name: "有时观察到" }).click();

    // 刷新后恢复
    await page.reload();
    await expect(page.getByText(/已恢复上次保存的 \d+ 条回答/)).toBeVisible();

    // 清除
    await page.getByRole("button", { name: "清除已保存数据" }).click();
    await page.reload();
    await expect(page.getByText(/已恢复上次保存/)).not.toBeVisible();
    const saved = await page.evaluate(() => window.localStorage.getItem("sg-observation-v1"));
    expect(saved).toBeNull();
  });

  test("不勾选保存则不写 localStorage", async ({ page }) => {
    await page.goto("/assessment/development");
    await page.getByRole("button", { name: "开始观察" }).click();
    const firstGroup = page.getByRole("radiogroup").first();
    await firstGroup.getByRole("radio", { name: "经常观察到" }).click();
    const saved = await page.evaluate(() => window.localStorage.getItem("sg-observation-v1"));
    expect(saved).toBeNull();
  });
});
