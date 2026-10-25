import { expect, test } from "@playwright/test";

test.describe("移动端导航", () => {
  test("汉堡菜单展开并可导航", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "打开菜单" }).click();
    const nav = page.getByRole("navigation", { name: "移动端导航" });
    await expect(nav).toBeVisible();
    await nav.getByRole("link", { name: "干预课程" }).click();
    await expect(page).toHaveURL(/\/courses/);
    await expect(page.getByRole("heading", { name: "干预课程" })).toBeVisible();
  });

  test("首页在移动端正常展示", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("search").first()).toBeVisible();
  });
});
