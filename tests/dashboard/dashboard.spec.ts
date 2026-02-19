import { test, expect } from '@playwright/test';
import { login } from '../helpers/auth';

test('dashboard loads correctly after login', async ({ page }) => {

    await login(page);

    await expect(page.getByTestId('dashboard-page')).toBeVisible();
    await expect(page.getByTestId('dashboard-welcome')).toBeVisible();
});
