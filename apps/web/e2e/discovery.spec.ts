import { expect, test } from "@playwright/test";

test("filters content and opens its detail", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /your front row/i })).toBeVisible();
  await page.getByRole("button", { name: "Documentary" }).click();
  await expect(page.getByText("Inside the Light Lab")).toBeVisible();
  await expect(page.getByText("Aurora Seoul Live")).toBeHidden();
  await page.getByRole("link", { name: /Inside the Light Lab/ }).click();
  await expect(page.getByRole("heading", { name: "Inside the Light Lab" })).toBeVisible();
});

test("persists a saved show", async ({ page }) => {
  await page.goto("/content/aurora-seoul");
  await page.getByRole("button", { name: "Save show" }).click();
  await page.goto("/saved");
  await expect(page.getByText("Aurora Seoul Live")).toBeVisible();
});
