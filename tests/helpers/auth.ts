import { Page, expect } from '@playwright/test';

export async function login(page: Page) {
  const email = 'testuser@example.com';
  const password = 'password123!';

  await page.goto('/login');
  await page.getByTestId('login-email').fill(email);
  await page.getByTestId('login-password').fill(password);
  await page.getByTestId('login-submit').click();

  await page.waitForURL('**/dashboard');
  await expect(page).toHaveURL(/dashboard/);
}