import { test, expect } from '@playwright/test';
import pool from './db';

test.describe('Signup → Verify → Login → Dashboard', () => {
  let testEmail: string;

  test.afterEach(async () => {
    await pool.query(
      'DELETE FROM job_applications WHERE user_id = (SELECT id FROM users WHERE email = $1)',
      [testEmail]
    );
    await pool.query('DELETE FROM users WHERE email = $1', [testEmail]);
  });

  test('user can sign up, verify via OTP, log in, and reach dashboard', async ({ page }) => {
    testEmail = `user_${Date.now().toString(36)}@example.com`;
    const password = 'TestPass123!';

    // 1. Signup
    await page.goto('http://localhost:5173/signup');
    await page.getByPlaceholder('John Doe').fill('Test User');
    await page.getByPlaceholder('name@company.com').fill(testEmail);
    await page.getByPlaceholder('••••••••').fill(password);
    await page.getByRole('button', { name: 'Create Account' }).click();

    // 2. Should land on verify-email page
    await expect(page).toHaveURL(/verify-email/);

    // 3. Fetch the raw OTP via the test-only endpoint
    const otpRes = await page.request.get(`http://localhost:5000/api/test/otp/${testEmail}`);
    const otpBody = await otpRes.json();
    const otp = otpBody.data.otp;
    expect(otp).toBeTruthy();
    expect(otp).toHaveLength(6);

    // 4. Enter OTP — one digit per box, in order
    const otpInputs = page.locator('.otp-input');
    for (let i = 0; i < otp.length; i++) {
      await otpInputs.nth(i).fill(otp[i]);
    }
    await page.getByRole('button', { name: 'Verify Email' }).click();

    // 5. Verifying should auto-redirect straight to dashboard
    await expect(page).toHaveURL(/dashboard/);
  });
});