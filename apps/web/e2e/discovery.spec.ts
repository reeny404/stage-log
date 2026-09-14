import { expect, test } from "@playwright/test";

test("explains the peak-event boundary and completes a queued entry", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /when everyone arrives at once/i })).toBeVisible();
  await page.getByRole("link", { name: /enter the traffic lab/i }).click();
  await expect(page.getByRole("heading", { name: /try the moment demand changes/i })).toBeVisible();
  await page.getByRole("button", { name: /run entry scenario/i }).click();
  await expect(page.getByRole("heading", { name: /you are in line/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /you’re in/i })).toBeVisible({ timeout: 10_000 });
});

test("persists a saved show", async ({ page }) => {
  await page.goto("/content/aurora-seoul", { waitUntil: "networkidle" });
  const saveButton = page.getByRole("button", { name: "Save show" });
  await saveButton.click();
  await expect(page.getByRole("button", { name: "Saved", pressed: true })).toBeVisible();
  await page.goto("/saved");
  await expect(page.getByRole("heading", { name: "Aurora Seoul Live" })).toBeVisible();
});

test("opens an always-available synchronized demo live room", async ({ page }) => {
  await page.goto("/content/aurora-seoul");
  await expect(page.getByText("DEMO LIVE", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Aurora Seoul Live" }).first()).toBeVisible();

  await page.getByRole("button", { name: "Pause demo broadcast" }).click();
  await expect(page.getByText(/PAUSED ·/)).toBeVisible();
  await page.getByRole("button", { name: /back to live/i }).click();
  await expect(page.getByText(/LIVE ·/)).toBeVisible();
});
