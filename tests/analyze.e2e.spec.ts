// tests/analyze.e2e.spec.ts
import bcrypt from "bcrypt";
import { test, expect } from "@playwright/test";
import pool from "./db";

test.describe("JD Analyze → appears in tracker", () => {
  const testEmail = `analyze_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}@example.com`;
  const testPassword = "TestPassword123!";

  test.afterEach(async () => {
    // FK-safe delete order, same as your integration tests
    await pool.query(
      `DELETE FROM job_applications WHERE user_id IN (SELECT id FROM users WHERE email = $1)`,
      [testEmail],
    );
    await pool.query(
      `DELETE FROM profiles WHERE user_id IN (SELECT id FROM users WHERE email = $1)`,
      [testEmail],
    );
    await pool.query(`DELETE FROM users WHERE email = $1`, [testEmail]);
  });

  test("paste JD, analyze, see it in tracker", async ({ page }) => {
    // --- Arrange: create a verified user + profile with cv_text directly in DB ---
    // (skipping the signup/OTP UI flow on purpose — Day 6 already proved that works;
    // re-running it here would just slow this test down for no new coverage)
    await pool.query(`DELETE FROM users WHERE email = $1`, [testEmail]);

    const hashedPassword = await bcrypt.hash(testPassword, 10);

    await pool.query(
      `INSERT INTO users (email, password_hash, is_verified, full_name) VALUES ($1, $2, true, $3)`,
      [testEmail, hashedPassword, "Test User"],
    );

    await pool.query(
      `INSERT INTO profiles (user_id, cv_text) 
   SELECT id, 'Fake CV text for testing' FROM users WHERE email = $1`,
      [testEmail],
    );

    // --- Act: log in through the real UI ---
    await page.goto("http://localhost:5173/login");
    await page.getByRole("textbox", { name: /email/i }).fill(testEmail);
    await page.getByRole("textbox", { name: /password/i }).fill(testPassword);
    await page.getByRole("button", { name: "Sign In", exact: true }).click();
    await expect(page).toHaveURL("http://localhost:5173/dashboard");

    // --- Act: paste JD and trigger analysis ---
    await page.goto("http://localhost:5173/analyze");
    await page
      .getByRole("textbox", { name: /company name/i })
      .fill("Acme Corp");
         await page
      .getByRole("textbox", { name: /role/i })
      .fill("Software Engineer");
    await page
      .getByRole("textbox", { name: /job description/i })
      .fill(
        "A ".repeat(20) +
          "sufficiently long fake job description to pass the character check.",
      );
    await page.getByRole("button", { name: /analyze/i }).click();

    // Wait for the button to finish "Analyzing…" and return to its idle state,
    // which only happens once the SSE 'complete' event fires and isAnalyzing → false
    await expect(
      page.getByRole("button", { name: "Analyze", exact: true }),
    ).toBeVisible({ timeout: 15000 });

    // --- Assert: navigate to tracker and confirm the entry appeared ---
    await page.goto("http://localhost:5173/tracker"); // adjust to your real route
    await expect(page.getByText("Software Engineer")).toBeVisible();
  });
});
