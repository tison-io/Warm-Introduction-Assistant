import { test, expect, Page } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

// Reusable login function
async function login(page: Page) {
    await page.goto(`${BASE_URL}/login`);
    await expect(page.getByTestId('login-email')).toBeVisible();

    await page.getByTestId('login-email').fill('founder@example.com');
    await page.getByTestId('login-password').fill('Password123');
    await page.getByTestId('login-submit').click();

    await page.waitForURL('**/dashboard', { timeout: 10000 });
}

// --- Test Data ---
const TEST_STARTUP_NAME = `TestStartup ${Date.now()}`;
const TEST_INVESTOR_NAME = `TestInvestor ${Date.now()}`;
const TEST_STARTUP_BLURB = 'We are building the next generation of AI-powered investment tools.';
const TEST_PITCH_LINK = 'https://pitchdeck.com/ai-invest';
const TEST_INVESTOR_PREFERENCES = 'Prefers highly quantitative introductions.';

// --- Helper Functions ---
async function fillStartupDetails(page: Page) {
    await page.getByTestId('input-name').fill(TEST_STARTUP_NAME);
    await page.getByTestId('input-blurb').fill(TEST_STARTUP_BLURB);
    await page.getByTestId('input-pitchLink').fill(TEST_PITCH_LINK);
    await page.getByTestId('submit-startup').click();
}

async function fillInvestorDetails(page: Page) {
    await page.getByTestId('input-name').fill(TEST_INVESTOR_NAME);
    await page.getByTestId('input-preferred_intro_format').selectOption('email');
    await page.getByTestId('input-intro_preferences_text').fill(TEST_INVESTOR_PREFERENCES);
    await page.getByTestId('input-tagInput').fill('Fintech');
    await page.getByTestId('input-tagInput').press('Enter');


    await page.getByTestId('submit-investor').click();

    const generateButton = page.getByRole('button', { name: 'Generate Customized Introduction' });
    await expect(generateButton).toBeVisible();

    await Promise.all([
        page.waitForURL('**/transform?**', { timeout: 30000 }), 
        generateButton.click(),
    ]);
}

async function reviewAndQueueIntro(page: Page) {
    const introTextarea = page.getByTestId('review-intro-textarea');
    let generatedContent = '';

    const GENERIC_CONTENT = 'Problem: [Not provided]'; 

    // --- Robust Wait Loop for Dynamic Content ---
    await test.step('Wait for AI-Generated Intro Content', async () => {
        await expect(page.getByTestId('page-generated-intro')).toBeVisible({ timeout: 10000 });
        
        const MAX_WAIT_TIME_MS = 60000;
        const POLLING_INTERVAL_MS = 2000;

        const startTime = Date.now();
        
        while (Date.now() - startTime < MAX_WAIT_TIME_MS) {
            generatedContent = await introTextarea.inputValue();
            
            // Check if content is ready: long enough AND does NOT contain the generic fallback
            if (generatedContent.length > 100 && !generatedContent.includes(GENERIC_CONTENT)) {
                console.log(`AI content loaded after ${Date.now() - startTime}ms.`);
                break;
            }
            
            // If content is not ready, reload the page to fetch the latest data from the server
            if (page.url().includes('/transform')) {
                await page.reload({ waitUntil: 'load' });
            } 
            // Wait for the polling interval before checking again
            await page.waitForTimeout(POLLING_INTERVAL_MS);
        }
        
        // Final assertions with correct custom message placement
        expect(
            generatedContent.length, 
            "Generated intro content is too short or was never loaded. (Check AI generation timeout/failure)."
        ).toBeGreaterThan(100);
        
        expect(
            generatedContent, 
            `Generated intro content still contains generic fallback text: "${GENERIC_CONTENT}".`
        ).not.toContain(GENERIC_CONTENT);
    }); 
    
    const investorNameElement = page.getByTestId('review-investor-name');
    await expect(investorNameElement).toContainText(TEST_INVESTOR_NAME);

    const formatElement = page.getByTestId('review-intro-format');
    await expect(formatElement).toContainText('Full Email Draft');
    
    const EDITED_SUFFIX = '\n\n-- Final review complete.';
    await introTextarea.fill(generatedContent + EDITED_SUFFIX);

    await page.getByTestId('review-save-btn').click();

    await expect(page.getByText(`Intro for ${TEST_INVESTOR_NAME} successfully saved to the queue!`)).toBeVisible();

    await expect(page.getByTestId('page-intro-queue')).toBeVisible();
    await expect(page).toHaveURL(/.*intro-queue/);
}


async function verifyAndCompleteIntro(page: Page) {
    await expect(page.getByTestId('queue-loading-spinner')).not.toBeVisible({ timeout: 10000 });

    const introRow = page.locator(`[data-testid^="intro-row-"]`, { hasText: TEST_INVESTOR_NAME }).first();
    await expect(introRow).toBeVisible();

    const introId = await introRow.getAttribute('data-testid');
    const toggleButton = page.getByTestId(introId!.replace('row', 'toggle-btn'));
    await toggleButton.click();

    const detailsPanel = page.getByTestId(introId!.replace('row', 'details-panel'));
    await expect(detailsPanel).toBeVisible();
    
    await expect(detailsPanel.getByTestId('details-status-select')).toHaveValue('queued');
    
    await detailsPanel.getByTestId('details-status-select').selectOption('sent');
    
    const followUpContainer = detailsPanel.getByTestId('details-followup-container');
    await expect(followUpContainer).toBeVisible();
    
    await detailsPanel.getByTestId('details-update-btn').click();

    await expect(page.getByText('Status updated to sent.')).toBeVisible();
    await expect(detailsPanel).not.toBeVisible();

    await toggleButton.click();
    await expect(detailsPanel).toBeVisible();
    
    await detailsPanel.getByTestId('details-status-select').selectOption('completed');
    await detailsPanel.getByTestId('details-update-btn').click();

    await expect(page.getByText('Status updated to completed.')).toBeVisible();
    await expect(detailsPanel).not.toBeVisible();
    
    await expect(introRow.getByText('Completed')).toBeVisible();
}

// --- MAIN TEST
test.describe('Intro Wizard and Queue Flow', () => {
    test('should successfully create an intro, queue it, and update its status', async ({ page }) => {
        await test.step('Step 0: Login to the application', async () => {
            await login(page);
        });

        // Start the wizard flow from dashboard
        await page.goto(`${BASE_URL}/intro-wizard`);

        // Step 1: Fill Startup Details
        await test.step('Step 1: Fill Startup Details', async () => {
            await fillStartupDetails(page);
        });

        // Step 2: Fill Investor Details
        await test.step('Step 2: Fill Investor Details', async () => {
            await fillInvestorDetails(page);
        });
        
        // Step 3: Review and Save Generated Intro
        await test.step('Step 3: Review and Save Generated Intro', async () => {
            await reviewAndQueueIntro(page);
        });

        // Step 4: Verify in Queue and Update Status
        await test.step('Step 4: Verify in Queue and Update Status', async () => {
            await verifyAndCompleteIntro(page);
        });
    });
});