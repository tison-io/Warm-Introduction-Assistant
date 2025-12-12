import { test, expect, Page } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

// Reusable login function
async function login(page: Page) {
    await page.goto(`${BASE_URL}/login`);

    await page.getByTestId('login-email').fill('founder@example.com');
    await page.getByTestId('login-password').fill('Password123');
    await page.getByTestId('login-submit').click();

    await page.waitForURL('**/dashboard', { timeout: 10000 });
}

test.describe('Startup CRUD Flow', () => {

    let createdStartupId: string;

    test('Create/Read/Edit/Delete a new startup', async ({ page }) => {
        await login(page);

        //---------CREATE test
        await page.goto(`${BASE_URL}/startups/new`);
        await expect (page.getByTestId('page-startup-create')).toBeVisible();
        await expect(page.getByTestId('startup-form')).toBeVisible();

        await page.getByTestId('input-name').fill('Playwright Test Startup');
        await page.getByTestId('input-blurb').fill('This is an automated test startup.');
        await page.getByTestId('input-pitchLink').fill('https://example.com/pitch');

        page.getByTestId('submit-startup').click();
        await page.waitForTimeout(2000);

        //-----Read test (Validate details on startup list page)
        await page.goto(`${BASE_URL}/startups`);
        await page.reload();    
        const StartupCard = page.getByText('Playwright Test Startup');
        await expect(StartupCard).toBeVisible();

        //Validate details on startup detail page
        await StartupCard.click();
        await expect(page.getByTestId('startup-title')).toHaveText('Playwright Test Startup');

        //------EDIT test
        await page.goto(`${BASE_URL}/startups`);

        const editStartupCard = page.getByTestId('startup-card').filter({
            hasText: 'Playwright Test Startup',
        });
    
        await expect(editStartupCard).toBeVisible(); 

        const editButton = editStartupCard.getByTestId('edit-startup-btn'); 
        await editButton.click();

        await expect(page.getByTestId('startup-form')).toBeVisible();
        await page.getByTestId('input-name').fill('Edited Test Startup');
        await page.getByTestId('submit-startup').click();

        await page.waitForURL('**/startups/**');

        //---------DELETE test
        const deleteStartupCard = page.getByTestId('startup-card').filter({
            hasText: 'Edited Test Startup',
        });

        await expect(deleteStartupCard).toBeVisible();

        const deleteButton = deleteStartupCard.getByTestId('delete-startup-btn');

        // Set up the dialog handler first
        page.once('dialog', async (dialog) => {
            expect(dialog.message()).toContain('Are you sure you want to delete this startup?');
            await dialog.accept();
        });

        await deleteButton.click();

        await page.waitForTimeout(1000);
        await page.reload();

        await expect(page.getByTestId('startup-card').filter({
            hasText: 'Edited Test Startup'
        })).toHaveCount(0);
    });
});
