// tests/login.spec.ts
//Founder details, email: founder@example.com , password: Password123  

import { test, expect } from '@playwright/test';

test.describe('Login Flow', () => {

    test('should successfully login and redirect to dashboard', async ({ page }) => {
        // Navigate
        await page.goto('/login');

        // Fill email
        await page.getByTestId('login-email').fill('founder@example.com');

        // Fill password
        await page.getByTestId('login-password').fill('Password123');

        // Submit
        await page.getByTestId('login-submit').click();

        // Expect redirect to dashboard
        await page.waitForURL('**/dashboard', { timeout: 10000 });

        // Validate localStorage token exists
        const token = await page.evaluate(() => localStorage.getItem('token'));
        expect(token).toBeTruthy();

        const user = await page.evaluate(() => localStorage.getItem('user'));
        expect(user).toBeTruthy();
    });

    test('should show login error for wrong credentials', async ({ page }) => {
        await page.goto('/login');

        await page.getByTestId('login-email').fill('wrong@example.com');
        await page.getByTestId('login-password').fill('wrongpass');

        await page.getByTestId('login-submit').click();

        // Expect error message
        const error = page.getByTestId('login-error');
        await expect(error).toBeVisible();
    });
});
