import { test, expect } from '@playwright/test';

test.describe('Signup Flow', () => {

  test('should successfully create an account with valid data', async ({ page }) => {
    const uniqueId = Date.now();
    const email = `testuser@example.com`;
    await page.goto('/signup');

    await page.getByTestId('signup-name').fill(`John Playwright${uniqueId}`);
    await page.getByTestId('signup-email').fill(email);
    
    await page.getByTestId('signup-phone').fill('+254700111222');
    
    await page.getByTestId('signup-password').fill('password123!');
    await page.getByTestId('signup-confirm-password').fill('password123!');

    await page.getByTestId('signup-submit').click();

    await expect(page.getByText(/account created/i)).toBeVisible();

    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
  });

  test('should redirect to Google for authentication', async ({ page }) => {
    await page.goto('/signup');

    await page.getByTestId('google-signup').click();

    await expect(page).toHaveURL(/.*google\.com.*/);
  });

  test('should show error message for mismatched passwords', async ({ page }) => {
    await page.goto('/signup');

    await page.getByTestId('signup-name').fill('Error User');
    await page.getByTestId('signup-email').fill('error@example.com');
    await page.getByTestId('signup-phone').fill('+254700000000');
    await page.getByTestId('signup-password').fill('Password123');
    await page.getByTestId('signup-confirm-password').fill('Password456');

    await page.getByTestId('signup-submit').click();
    await expect(page.getByText(/passwords do not match/i)).toBeVisible();
  });
});