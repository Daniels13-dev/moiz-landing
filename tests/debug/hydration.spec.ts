import { test } from '@playwright/test';

test('capture console logs for hydration issues', async ({ page }) => {
  const logs: string[] = [];
  page.on('console', (msg) => {
    logs.push(`${msg.type()}: ${msg.text()}`);
  });

  await page.goto('/');
  await page.waitForLoadState('networkidle');

  // wait a bit to let any hydration messages appear
  await page.waitForTimeout(1000);

  // print collected logs to stdout so the runner shows them
  console.log('--- CONSOLE LOGS START ---');
  for (const l of logs) console.log(l);
  console.log('--- CONSOLE LOGS END ---');
});
