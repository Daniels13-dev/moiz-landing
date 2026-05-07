import { test, expect } from "@playwright/test";

test("hero visual snapshot", async ({ page }) => {
  await page.goto("/");
  // select the hero section by id
  const hero = page.locator("#hero");
  await hero.waitFor();
  await expect(hero).toHaveScreenshot("hero.png", { animations: "disabled" });
});
