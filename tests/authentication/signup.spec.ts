// tests/signup.spec.ts
import { test, expect } from '@playwright/test';


test.describe('Signup Flow (Real Backend)', () => {

    test('should successfully create an account', async ({ page }) => {
        const uniqueTimestamp = Date.now();
        const randomName = `Playwright User ${uniqueTimestamp}`;
        const randomEmail = `founder+${uniqueTimestamp}@example.com`;

        await page.goto('/signup');

        await page.getByTestId('signup-name').fill(randomName);
        await page.getByTestId('signup-email').fill(randomEmail);
        await page.getByTestId('signup-country-code').selectOption('+254');
        await page.getByTestId('signup-phone').fill('712345678');
        await page.getByTestId('signup-password').fill('Password123');
        await page.getByTestId('signup-confirm-password').fill('Password123');

        await page.getByTestId('signup-terms').check();

        // Submit
        await page.getByTestId('signup-submit').click();

        // Expect redirect to login after 2 seconds
        await page.waitForURL('**/login', { timeout: 10000 });
    });
});
