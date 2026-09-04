import { test, expect } from '@playwright/test';

test('login page renders correctly', async ({ page }) => {
  // 1. Go to the login page.
  await page.goto('http://localhost:5173/login');
  //    What's the actual URL? (localhost:5173/login, or wherever your route is)

  // 2. Assert something meaningful is visible — NOT just "the page loaded".
  //    Think: what's a real user's evidence they're looking at a login form?
  //    e.g. a heading, an email input, a "Log in" button — pick via getByRole,
  //    same as RTL.
  await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible();
});