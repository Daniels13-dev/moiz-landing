import { test, expect } from "@playwright/test";

test("product carousel snapshot", async ({ page }) => {
  await page.goto("/");
  // scroll to product section
  await page.locator("#producto").scrollIntoViewIfNeeded();
  const carousel = page.locator("#producto");
  await carousel.waitFor();
  await expect(carousel).toHaveScreenshot("carousel.png", {
    animations: "disabled",
  });
});
