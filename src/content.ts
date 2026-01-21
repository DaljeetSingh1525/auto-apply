export { }

// ============================================
// CANDIDATE DATA
// ============================================
const CANDIDATE_DATA = {
  firstName: "Nikhil",
  lastName: "Garia",
  email: "nikhil190.ng@gmail.com",
  phone: "8430305550",
  city: "California City",
  state: "California",
  country: "United States",
  address: "California City, CA, USA",
  postalCode: "123456",
  linkedin: "linkedin.com/in/nikhil-garia-1st",
  experience: "4+ years",
  resumeUrl: "https://mrd-live.s3.amazonaws.com/mrd-developer-resume/20250709112810USA_Nikhil_Garia_DevSecOps_Engineer_CV.pdf"
};

console.log("Job Auto Apply Extension Loaded!");
console.log("Current URL:", window.location.href);

// ============================================
// UTILITY FUNCTIONS
// ============================================
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function isVisible(element: HTMLElement): boolean {
  return !!(element.offsetWidth || element.offsetHeight || element.getClientRects().length);
}

function showNotification(message: string, type: 'success' | 'info' | 'error' | 'warning' = 'info') {
  const colors = {
    success: '#10b981',
    info: '#3b82f6',
    error: '#ef4444',
    warning: '#f59e0b'
  };

  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${colors[type]};
    color: white;
    padding: 16px 24px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: bold;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    z-index: 99999;
    animation: slideIn 0.3s ease-out;
  `;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  }, 5000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(400px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(400px); opacity: 0; }
  }
`;
document.head.appendChild(style);

// ============================================
// STEP 1: DETECT PAGE TYPE
// ============================================
function detectPageType(): 'job-listing' | 'job-details' | 'apply-options' | 'application-form' | 'unknown' {
  const url = window.location.href.toLowerCase();

  // Application form page (after clicking Apply Manually)
  if (url.includes('applymanually') || document.querySelector('[data-automation-id="applyFlowPage"]')) {
    return 'application-form';
  }

  // Apply options page (Apply Manually / Apply with Resume)
  if (url.includes('/apply/') && document.querySelector('[data-automation-id="applyManually"]')) {
    return 'apply-options';
  }

  // Job details page (single job with Apply button)
  // Check for Apply button first - most reliable indicator
  if (document.querySelector('button[data-automation-id="apply"]') ||
    document.querySelector('a[data-automation-id="apply"]')) {
    return 'job-details';
  }

  // Also check URL patterns for job details
  if (url.includes('/details/') || url.includes('/job/')) {
    // Double check for Apply button
    const applyButtons = Array.from(document.querySelectorAll('button, a'));
    const hasApplyButton = applyButtons.some(btn =>
      btn.textContent?.trim().toLowerCase() === 'apply'
    );
    if (hasApplyButton) {
      return 'job-details';
    }
  }

  // Job listing page (multiple jobs)
  if (url.includes('workday') || url.includes('jobs')) {
    return 'job-listing';
  }

  return 'unknown';
}

// ============================================
// STEP 2: CLICK "APPLY" BUTTON ON JOB DETAILS
// ============================================
async function clickApplyButton(): Promise<boolean> {
  console.log("Looking for 'Apply' button");
  showNotification("Looking for Apply button", "info");

  await sleep(1000);

  const selectors = [
    'button[data-automation-id="apply"]',
    'a[data-automation-id="apply"]',
    '[aria-label*="Apply" i]'
  ];

  for (const selector of selectors) {
    const button = document.querySelector(selector);
    if (button && isVisible(button as HTMLElement)) {
      console.log("Apply button found!");
      showNotification("Apply button found! Clicking", "success");
      await sleep(500);
      (button as HTMLElement).click();
      return true;
    }
  }

  // Fallback: search by text
  const allButtons = document.querySelectorAll('button, a');
  for (const button of allButtons) {
    const text = button.textContent?.trim().toLowerCase() || '';
    if ((text === 'apply' || text === 'apply now') && isVisible(button as HTMLElement)) {
      console.log("Apply button found by text!");
      showNotification("Apply button found! Clicking...", "success");
      await sleep(500);
      (button as HTMLElement).click();
      return true;
    }
  }

  console.log("Apply button not found");
  showNotification("Apply button not found", "error");
  return false;
}

// ============================================
// STEP 3: CLICK "APPLY MANUALLY" BUTTON
// ============================================
async function clickApplyManually(): Promise<boolean> {
  console.log("Looking for 'Apply Manually' button");
  showNotification("Looking for Apply Manually", "info");

  await sleep(1500); // Wait for popup to appear

  // Try multiple selectors for Apply Manually button
  const selectors = [
    'a[data-automation-id="applyManually"]',
    'button:contains("Apply Manually")',
    'a:contains("Apply Manually")'
  ];

  for (const selector of selectors) {
    const button = document.querySelector(selector);
    if (button && isVisible(button as HTMLElement)) {
      console.log("'Apply Manually' found with selector:", selector);
      showNotification("Clicking Apply Manually", "success");
      await sleep(500);
      (button as HTMLElement).click();
      return true;
    }
  }

  // Fallback: Search all buttons and links by text
  const allElements = document.querySelectorAll('button, a');
  for (const element of allElements) {
    const text = element.textContent?.trim() || '';
    if (text === 'Apply Manually') {
      console.log("'Apply Manually' found by exact text match!");
      showNotification("Clicking Apply Manually", "success");
      await sleep(500);
      (element as HTMLElement).click();
      return true;
    }
  }

  // Try case-insensitive match
  for (const element of allElements) {
    const text = element.textContent?.trim().toLowerCase() || '';
    if (text === 'apply manually') {
      console.log("'Apply Manually' found by case-insensitive match!");
      showNotification("Clicking Apply Manually", "success");
      await sleep(500);
      (element as HTMLElement).click();
      return true;
    }
  }

  console.log("'Apply Manually' button not found");
  showNotification("Could not find Apply Manually button", "error");

  // Log all visible buttons for debugging
  console.log("All visible buttons/links found:");
  allElements.forEach((el, i) => {
    if (isVisible(el as HTMLElement)) {
      console.log(`  ${i + 1}. "${el.textContent?.trim()}"`);
    }
  });

  return false;
}

// ============================================
// STEP 4: SCRAPE FORM QUESTIONS
// ============================================
interface Question {
  label: string;
  type: string;
  name: string;
  id: string;
  required: boolean;
  options?: string[];
}

function scrapeQuestions(): Question[] {
  console.log("STEP 4: Scraping form questions...");
  console.log("=".repeat(60));

  const questions: Question[] = [];

  // Scrape text inputs
  const textInputs = document.querySelectorAll('input[type="text"]:not([type="hidden"])');
  textInputs.forEach(input => {
    const label = input.closest('div')?.querySelector('label')?.textContent?.replace(/\*/g, '').trim() || '';
    if (label && label.length > 2) {
      const question: Question = {
        label,
        type: 'text',
        name: (input as HTMLInputElement).name,
        id: (input as HTMLInputElement).id,
        required: (input as HTMLInputElement).getAttribute('aria-required') === 'true'
      };
      questions.push(question);
      console.log(`Text: "${label}" (${question.id}) - Required: ${question.required}`);
    }
  });

  // Scrape radio groups
  const radioGroups = new Set<string>();
  document.querySelectorAll('input[type="radio"]').forEach(radio => {
    const name = (radio as HTMLInputElement).name;
    if (name && !radioGroups.has(name)) {
      radioGroups.add(name);
      const fieldset = radio.closest('fieldset');
      const label = fieldset?.querySelector('legend label')?.textContent?.replace(/\*/g, '').trim() || '';

      const options = Array.from(document.querySelectorAll(`input[name="${name}"]`))
        .map(r => r.closest('label')?.textContent?.trim() || (r as HTMLInputElement).value);

      if (label) {
        questions.push({
          label,
          type: 'radio',
          name,
          id: '',
          required: true,
          options
        });
        console.log(`Radio: "${label}" - Options: [${options.join(', ')}]`);
      }
    }
  });

  // Scrape dropdowns
  document.querySelectorAll('select, button[aria-haspopup="listbox"]').forEach(dropdown => {
    const label = dropdown.closest('div[data-automation-id^="formField"]')?.querySelector('label')?.textContent?.replace(/\*/g, '').trim() || '';
    if (label && label.length > 2) {
      questions.push({
        label,
        type: 'select',
        name: (dropdown as HTMLElement).getAttribute('name') || '',
        id: (dropdown as HTMLElement).id,
        required: true
      });
      console.log(`📝 Dropdown: "${label}" (${(dropdown as HTMLElement).id})`);
    }
  });

  console.log("=".repeat(60));
  console.log(`Total questions scraped: ${questions.length}`);
  console.log("=".repeat(60));

  return questions;
}

// ============================================
// STEP 5: FILL APPLICATION FORM
// ============================================
function fillInput(element: HTMLInputElement | HTMLTextAreaElement, value: string): boolean {
  if (!element) return false;
  element.focus();
  element.value = value;
  element.dispatchEvent(new Event('input', { bubbles: true }));
  element.dispatchEvent(new Event('change', { bubbles: true }));
  element.dispatchEvent(new Event('blur', { bubbles: true }));
  element.blur();
  console.log(`Filled: ${element.id || element.name} = ${value}`);
  return true;
}

async function fillForm() {
  console.log("STEP 5: Filling application form");
  showNotification("Filling form with your data", "info");

  await sleep(2000);

  // Fill "How Did You Hear About Us?"
  const sourceInput = document.getElementById('source--source') as HTMLInputElement;
  console.log("sourceInput=", sourceInput);

  if (!sourceInput) {
    console.log('Source input not found, trying alternative selector');
    // Try finding by placeholder or other attributes
    const searchInputs = document.querySelectorAll('input[placeholder="Search"]');
    for (const input of searchInputs) {
      const container = input.closest('[data-automation-id="multiSelectContainer"]');
      if (container) {
        // Found the right input
        await fillSourceField(input as HTMLInputElement);
        return;
      }
    }
  }

  async function fillSourceField(inputElement: HTMLInputElement) {
    // Make sure dropdown is open
    const inputContainer = inputElement.closest('[data-automation-id="multiselectInputContainer"]') as HTMLElement;
    if (inputContainer) {
      inputContainer.click();
      await sleep(300);
    }

    // Find and click "Advertisement" option to expand it
    await sleep(500);

    const options = document.querySelectorAll('[data-automation-id="promptOption"]');
    let advertisementOption: HTMLElement | null = null;

    for (const option of options) {
      if (option.textContent?.trim() === 'Advertisement') {
        advertisementOption = option.parentElement as HTMLElement; // Click the parent container
        break;
      }
    }

    if (advertisementOption) {
      advertisementOption.click();
      console.log('Clicked Advertisement to expand');
      await sleep(800);

      // Now find sub-options (they should appear after expansion)
      const allOptions = document.querySelectorAll('[data-automation-id="promptOption"]');

      // Look for "Internet Advertisement" or similar
      for (const option of allOptions) {
        const text = option.textContent?.trim();
        if (text && text.includes('Internet')) {
          (option.parentElement as HTMLElement).click();
          console.log(`Selected: ${text}`);
          await sleep(300);
          return;
        }
      }

      // If no "Internet" option found, click the first sub-option
      if (allOptions.length > 4) { // More than the 4 parent options
        (allOptions[4].parentElement as HTMLElement).click();
        console.log('Selected first sub-option');
      }
    } else {
      console.log('Could not find Advertisement option');
    }
  }

  // Call the function
  if (sourceInput) {
    await fillSourceField(sourceInput);
  }


  await sleep(400);

  // Click "No" for previously worked
  const noRadio = document.querySelector('input[name="candidateIsPreviousWorker"][value="false"]') as HTMLInputElement;
  if (noRadio) {
    noRadio.checked = true;
    noRadio.click();
    noRadio.dispatchEvent(new Event('change', { bubbles: true }));
    console.log('Selected: No (previously worked)');
  }
  await sleep(400);

  // Fill name fields
  const firstNameInput = document.getElementById('name--legalName--firstName') as HTMLInputElement;
  if (firstNameInput) fillInput(firstNameInput, CANDIDATE_DATA.firstName);
  await sleep(400);

  const lastNameInput = document.getElementById('name--legalName--lastName') as HTMLInputElement;
  if (lastNameInput) fillInput(lastNameInput, CANDIDATE_DATA.lastName);
  await sleep(400);

  // Fill address
  const addressInput = document.getElementById('address--addressLine1') as HTMLInputElement;
  if (addressInput) fillInput(addressInput, CANDIDATE_DATA.address);
  await sleep(400);

  const cityInput = document.getElementById('address--city') as HTMLInputElement;
  if (cityInput) fillInput(cityInput, CANDIDATE_DATA.city);
  await sleep(400);

  const postalInput = document.getElementById('address--postalCode') as HTMLInputElement;
  if (postalInput) fillInput(postalInput, CANDIDATE_DATA.postalCode);
  await sleep(400);

  // Fill phone
  const phoneInput = document.getElementById('phoneNumber--phoneNumber') as HTMLInputElement;
  if (phoneInput) fillInput(phoneInput, CANDIDATE_DATA.phone);
  await sleep(400);

  console.log("Form filled successfully!");
  showNotification("Form filled! Ready to submit...", "success");
}

// ============================================
// STEP 6: SUBMIT FORM
// ============================================
async function submitForm(): Promise<boolean> {
  console.log("STEP 6: Submitting form");
  showNotification("Submitting application", "info");

  await sleep(1000);

  const submitButton = document.querySelector('button[data-automation-id="pageFooterNextButton"]');

  if (submitButton && isVisible(submitButton as HTMLElement)) {
    console.log("Submit button found!");
    await sleep(500);
    (submitButton as HTMLElement).click();
    console.log("Form submitted!");
    showNotification("Application submitted successfully!", "success");
    return true;
  }

  // Fallback
  const allButtons = document.querySelectorAll('button');
  for (const button of allButtons) {
    const text = button.textContent?.trim().toLowerCase() || '';
    if (text.includes('save and continue') || text.includes('submit')) {
      console.log("Submit button found by text!");
      await sleep(500);
      (button as HTMLElement).click();
      console.log("Form submitted!");
      showNotification("Application submitted successfully!", "success");
      return true;
    }
  }

  console.log("Submit button not found");
  showNotification("Could not find submit button", "error");
  return false;
}

// ============================================
// MAIN FLOW ORCHESTRATOR
// ============================================
async function executeFlow() {
  console.log("\n" + "=".repeat(60));
  console.log("JOB AUTO-APPLY FLOW STARTED");
  console.log("=".repeat(60) + "\n");

  const pageType = detectPageType();
  console.log(`Page Type: ${pageType}`);

  switch (pageType) {
    case 'job-listing':
      console.log("On job listing page - Please select a specific job first");
      showNotification("Please click on a specific job to apply", "info");
      break;

    case 'job-details':
      console.log("Stage 1: Job Details Page");
      showNotification("Job details page detected!", "info");
      await sleep(1000);

      const applyClicked = await clickApplyButton();
      if (applyClicked) {
        console.log("Waiting for popup/next page...");
        showNotification("Apply clicked! Waiting for options...", "info");
        await sleep(3000);

        // Check if popup appeared with Apply Manually option
        const applyManuallyExists = document.querySelector('a[data-automation-id="applyManually"]') ||
          Array.from(document.querySelectorAll('button, a')).some(el =>
            el.textContent?.trim() === 'Apply Manually'
          );

        if (applyManuallyExists) {
          console.log("Popup detected with Apply Manually option");
          await clickApplyManually();
          console.log("Waiting for application form...");
          await sleep(3000);
        }
      }
      break;

    case 'apply-options':
      console.log("Stage 2: Apply Options Page");
      showNotification("Apply options page detected!", "info");
      await sleep(1000);

      const manuallyClicked = await clickApplyManually();
      if (manuallyClicked) {
        console.log("Waiting for application form...");
        await sleep(3000);
        // Flow will continue when URL changes
      }
      break;

    case 'application-form':
      console.log("Stage 3: Application Form Page");
      showNotification("Application form detected!", "info");
      await sleep(2000);

      // Scrape questions
      const questions = scrapeQuestions();
      await sleep(1000);

      // Fill form
      await fillForm();
      await sleep(2000);

      // Submit
      await submitForm();

      console.log("\n" + "=".repeat(60));
      console.log("AUTO-APPLY PROCESS COMPLETE!");
      console.log("=".repeat(60) + "\n");
      break;

    case 'unknown':
      console.log("Unknown page type - Extension is idle");
      break;
  }
}

// ============================================
// INITIALIZE ON PAGE LOAD
// ============================================
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log("Page loaded, waiting for elements...");
    setTimeout(executeFlow, 2000); // Give page time to fully render
  });
} else {
  console.log("Document ready, waiting for elements...");
  setTimeout(executeFlow, 2000); // Give page time to fully render
}

// ============================================
// WATCH FOR URL CHANGES (SPA NAVIGATION)
// ============================================
let lastUrl = location.href;
new MutationObserver(() => {
  const currentUrl = location.href;
  if (currentUrl !== lastUrl) {
    lastUrl = currentUrl;
    console.log("URL changed:", currentUrl);
    setTimeout(executeFlow, 1500);
  }
}).observe(document, { subtree: true, childList: true });

// ============================================
// WATCH FOR NEW FORM FIELDS (DYNAMIC FORMS)
// ============================================
const formObserver = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    if (mutation.addedNodes.length > 0) {
      const hasNewInputs = Array.from(mutation.addedNodes).some(node => {
        if (node.nodeType === 1) {
          const element = node as Element;
          return element.querySelector('input, select, textarea') !== null;
        }
        return false;
      });

      if (hasNewInputs && detectPageType() === 'application-form') {
        console.log("New form fields detected");
        setTimeout(fillForm, 1000);
        break;
      }
    }
  }
});

if (document.body) {
  formObserver.observe(document.body, { childList: true, subtree: true });
}