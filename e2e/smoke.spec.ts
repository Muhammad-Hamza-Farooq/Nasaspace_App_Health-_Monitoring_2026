import { expect, test } from "@playwright/test";

test("PULSE smoke: tabs, storm, LOS/AOS, sources", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (err) => errors.push(err.message));
  page.on("console", (msg) => {
    if (msg.type() !== "error") return;
    const text = msg.text();
    // Ignore favicon / optional network noise (Supabase optional sync may 401 before RLS)
    if (text.includes("Failed to load resource")) return;
    if (text.includes("same key")) return;
    errors.push(text);
  });

  await page.goto("/");
  await expect(page.getByTestId("pulse-shell")).toBeVisible();
  await expect(page.locator(".brand")).toHaveText("PULSE");
  await expect(page.getByTestId("sim-banner")).toBeVisible();
  await expect(page.getByTestId("tab-overview")).toBeVisible();

  for (const id of [
    "vitals",
    "radiation",
    "environment",
    "countermeasures",
    "behavioral",
    "rules",
    "overview",
  ]) {
    await page.getByTestId(`nav-${id}`).click();
    await expect(page.getByTestId(`tab-${id}`)).toBeVisible({ timeout: 10000 });
  }

  await page.getByTestId("nav-overview").click();
  await page.getByTestId("storm-toggle").click();
  await expect(page.getByTestId("status-storm")).toHaveText("STORM");

  await page.getByTestId("link-toggle").click();
  await expect(page.getByTestId("status-link")).toHaveText("LINK LOS");
  await page.getByTestId("escalate-btn").click();
  await expect(page.getByTestId("escalation-queue")).toContainText("QUEUED-FS");
  await page.getByTestId("link-toggle").click();
  await expect(page.getByTestId("status-link")).toHaveText("LINK AOS");

  await page.getByTestId("nav-vitals").click();
  const hr1 = await page.getByTestId("vitals-hr").textContent();
  await page.waitForTimeout(2000);
  const hr2 = await page.getByTestId("vitals-tick").textContent();
  expect(hr1).toBeTruthy();
  expect(hr2).toBeTruthy();

  await page.getByTestId("inject-blind").click();
  await expect(page.getByTestId("blind-message")).toContainText("BLIND");

  await page.getByTestId("nav-behavioral").click();
  await page.getByTestId("mood-submit").click();

  await page.getByTestId("nav-rules").click();
  const sources = page.getByTestId("all-sources").locator("li");
  await expect(sources).toHaveCount(19);
  await expect(page.getByTestId("official-sources").locator("li")).toHaveCount(5);

  await page.getByTestId("nav-overview").click();
  await page.getByTestId("demo-mode-btn").click();
  await expect(page.getByTestId("demo-overlay")).toBeVisible();
  await expect(page.getByTestId("demo-title")).toBeVisible();
  await page.getByTestId("demo-stop").click();

  expect(errors).toEqual([]);
});
