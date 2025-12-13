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

test.describe('Investor CRUD Flow', () => {

    const testInvestorName = 'Playwright Test Investor';
    const editedInvestorName = 'Edited Test Investor';
    const initialTags = 'Venture Capital,B2B';
    const editedTags = 'Seed Stage,Deep Tech';
    const preferredFormat = 'email';
    const preferredFormatEdited = '3-bullet-lines';

    test('Create/Read/Edit/Delete a new investor', async ({ page }) => {
        await login(page);

        //--- CREATE test
        await page.goto(`${BASE_URL}/investors/create`);
        await expect(page.getByTestId('page-investor-create')).toBeVisible();
        await expect(page.getByTestId('investor-form')).toBeVisible();

        await page.getByTestId('input-name').fill(testInvestorName);
        await page.getByTestId('input-preferred_intro_format').selectOption(preferredFormat);
        await page.getByTestId('input-intro_preferences_text').fill('Prefers warm intros only');
        await page.getByTestId('input-tagInput').fill('Venture Capital');
        await page.getByTestId('input-tagInput').press('Enter');
        await page.getByTestId('input-tagInput').fill('B2B');
        await page.getByTestId('input-tagInput').press('Enter');

        await page.getByTestId('submit-investor').click();
    
        await page.waitForURL('**/investors', { timeout: 5000 });
        await page.goto(`${BASE_URL}/investors`);
        await page.reload();
        
        //---READ test (Find the investor row by name text)
        const investorRow = page.getByTestId('investor-row').filter({
            hasText: testInvestorName,
        });
        await expect(investorRow).toBeVisible();

        // --- EDIT test ---
        const editInvestorRow = page.getByTestId('investor-row').filter({
            hasText: testInvestorName,
        });

        await expect(editInvestorRow).toBeVisible(); 

        const editButton = editInvestorRow.getByTestId('edit-investor-btn'); 
        await editButton.click();

        await expect(page.getByTestId('page-investor-edit')).toBeVisible();
        await expect(page.getByTestId('investor-form')).toBeVisible();
        await page.getByTestId('input-name').fill(editedInvestorName);
        
        await page.getByTestId('submit-investor').click();
        await page.waitForURL('**/investors');
        await page.reload();

        // Verify changes
        const updatedInvestorRow = page.getByTestId('investor-row').filter({
            hasText: editedInvestorName,
        });
        await expect(updatedInvestorRow).toBeVisible();

        // --- DELETE test
        const deleteInvestorRow = page.getByTestId('investor-row').filter({
            hasText: editedInvestorName,
        });
        await expect(deleteInvestorRow).toBeVisible();

        const deleteButton = deleteInvestorRow.getByTestId('delete-investor-btn');
        page.once('dialog', async (dialog) => {
            expect(dialog.message()).toContain('Are you sure you want to delete this investor?');
            await dialog.accept();
        });
        await deleteButton.click();

        await page.waitForTimeout(1000); 
        await page.reload();

        await expect(page.getByTestId('investor-row').filter({
            hasText: editedInvestorName
        })).toHaveCount(0);
    });
});