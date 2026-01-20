export {}

// Candidate data
const CANDIDATE_DATA = {
  firstName: "Nikhil",
  lastName: "Garia",
  legalName: "Nikhil",
  familyName: "Garia",
  email: "nikhil190.ng@gmail.com",
  phone: "19702584069",
  city: "California City",
  state: "California",
  country: "United States",
  address: "California City, CA, USA",
  linkedin: "linkedin.com/in/nikhil-garia-1st",
  experience: "4+ years",
  resumeUrl: "https://mrd-live.s3.amazonaws.com/mrd-developer-resume/20250709112810USA_Nikhil_Garia_DevSecOps_Engineer_CV.pdf"
};

console.log("Job Auto Apply Extension Loaded!");
console.log("Current URL:", window.location.href);


function isVisible(element: HTMLElement): boolean {
  return !!(element.offsetWidth || element.offsetHeight || element.getClientRects().length);
}

// ============================================
// STEP 2 & 3: DETECT AND AUTO-CLICK "APPLY NOW" BUTTON
// ============================================
async function detectAndClickApplyButton(): Promise<boolean> {
  console.log("Detecting 'Apply Now' button...");
  
  const selectors = [
    'button[data-automation-id="apply"]',
    'a[data-automation-id="apply"]',
    '[aria-label*="Apply" i]'
  ];
  
  for (const selector of selectors) {
    try {
      const button = document.querySelector(selector);
      if (button && isVisible(button as HTMLElement)) {
        console.log("Apply button found:", selector);
        console.log("Auto-clicking Apply button");
        (button as HTMLElement).click();
        return true;
      }
    } catch (e) {}
  }
  
  const allButtons = document.querySelectorAll('button, a');
  for (const button of allButtons) {
    const text = button.textContent?.trim().toLowerCase() || '';
    if ((text === 'apply' || text === 'apply now') && isVisible(button as HTMLElement)) {
      console.log("Apply button found by text:", text);
      console.log("Auto-clicking Apply button...");
      (button as HTMLElement).click();
      return true;
    }
  }
  
  console.log("Apply button not found on this page");
  return false;
}

// ============================================
//  DETECT AND CLICK "APPLY MANUALLY" BUTTON
// ============================================



async function detectAndClickApplyManually(): Promise<boolean> {
  console.log("Detecting 'Apply Manually' button");
  
  await sleep(2000);
  
  const applyManuallyButton = document.querySelector('a[data-automation-id="applyManually"]');
  
  if (applyManuallyButton && isVisible(applyManuallyButton as HTMLElement)) {
    console.log("'Apply Manually' button found!");
    console.log("Auto-clicking 'Apply Manually'...");
    (applyManuallyButton as HTMLElement).click();
    return true;
  }
  
  const allLinks = document.querySelectorAll('a');
  for (const link of allLinks) {
    const text = link.textContent?.trim().toLowerCase() || '';
    if (text === 'apply manually' || text.includes('apply manually')) {
      console.log("'Apply Manually' link found by text!");
      console.log("Auto-clicking 'Apply Manually'...");
      (link as HTMLElement).click();
      return true;
    }
  }
  
  console.log("'Apply Manually' button not found");
  return false;
}


// Helper function to wait
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to fill text input with better event triggering
function fillInput(element: HTMLInputElement | HTMLTextAreaElement, value: string) {
  if (!element) return false;
  
  // Focus the element first
  element.focus();
  
  // Set value
  element.value = value;
  
  // Trigger all possible events
  element.dispatchEvent(new Event('input', { bubbles: true }));
  element.dispatchEvent(new Event('change', { bubbles: true }));
  element.dispatchEvent(new Event('blur', { bubbles: true }));
  element.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true }));
  element.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
  
  // Blur the element
  element.blur();
  
  console.log(`Filled: ${element.name || element.id || 'unknown'} = ${value}`);
  return true;
}

// Find and fill by multiple strategies
function smartFill(keywords: string[], value: string): boolean {
  // Strategy 1: Find by input attributes
  for (const keyword of keywords) {
    // By name attribute
    let elements = document.querySelectorAll(`input[name*="${keyword}" i], textarea[name*="${keyword}" i]`);
    for (const el of elements) {
      if (fillInput(el as HTMLInputElement, value)) return true;
    }
    
    // By id attribute
    elements = document.querySelectorAll(`input[id*="${keyword}" i], textarea[id*="${keyword}" i]`);
    for (const el of elements) {
      if (fillInput(el as HTMLInputElement, value)) return true;
    }
    
    // By aria-label
    elements = document.querySelectorAll(`input[aria-label*="${keyword}" i], textarea[aria-label*="${keyword}" i]`);
    for (const el of elements) {
      if (fillInput(el as HTMLInputElement, value)) return true;
    }
    
    // By placeholder
    elements = document.querySelectorAll(`input[placeholder*="${keyword}" i], textarea[placeholder*="${keyword}" i]`);
    for (const el of elements) {
      if (fillInput(el as HTMLInputElement, value)) return true;
    }
  }
  
  // Strategy 2: Find by label text
  const labels = document.querySelectorAll('label');
  for (const label of labels) {
    const labelText = label.textContent?.toLowerCase() || '';
    if (keywords.some(kw => labelText.includes(kw.toLowerCase()))) {
      const forAttr = label.getAttribute('for');
      if (forAttr) {
        const input = document.getElementById(forAttr) as HTMLInputElement;
        if (input && (input.tagName === 'INPUT' || input.tagName === 'TEXTAREA')) {
          if (fillInput(input, value)) return true;
        }
      }
      
      // Sometimes label wraps the input
      const input = label.querySelector('input, textarea') as HTMLInputElement;
      if (input) {
        if (fillInput(input, value)) return true;
      }
    }
  }
  
  return false;
}

// Helper to select dropdown option
function smartSelect(keywords: string[], valueToFind: string): boolean {
  const selects = document.querySelectorAll('select');
  
  for (const select of selects) {
    const selectName = (select.name || select.id || select.getAttribute('aria-label') || '').toLowerCase();
    
    if (keywords.some(kw => selectName.includes(kw.toLowerCase()))) {
      const options = Array.from(select.options);
      const targetOption = options.find(opt => 
        opt.text.toLowerCase().includes(valueToFind.toLowerCase()) ||
        opt.value.toLowerCase().includes(valueToFind.toLowerCase())
      );
      
      if (targetOption) {
        select.value = targetOption.value;
        select.dispatchEvent(new Event('change', { bubbles: true }));
        select.dispatchEvent(new Event('blur', { bubbles: true }));
        console.log(`Selected: ${select.name || select.id} = ${valueToFind}`);
        return true;
      }
    }
  }
  
  return false;
}

// Helper to click radio button
function smartClickRadio(keywords: string[]): boolean {
  const radios = document.querySelectorAll('input[type="radio"]');
  
  for (const radio of radios) {
    const label = radio.closest('label')?.textContent?.toLowerCase() || '';
    const ariaLabel = (radio as HTMLInputElement).getAttribute('aria-label')?.toLowerCase() || '';
    const value = (radio as HTMLInputElement).value?.toLowerCase() || '';
    
    if (keywords.some(kw => label.includes(kw.toLowerCase()) || ariaLabel.includes(kw.toLowerCase()) || value.includes(kw.toLowerCase()))) {
      (radio as HTMLInputElement).checked = true;
      (radio as HTMLInputElement).click();
      radio.dispatchEvent(new Event('change', { bubbles: true }));
      console.log(`Clicked radio: ${keywords[0]}`);
      return true;
    }
  }
  
  return false;
}

// Main auto-fill function
async function autoFillForm() {
  console.log("Starting auto-fill process...");
  
  await sleep(1500);
  
  // Fill all fields with smart detection
  console.log("Filling name fields...");
  smartFill(['legal', 'given', 'first'], CANDIDATE_DATA.firstName);
  await sleep(400);
  
  smartFill(['family', 'last', 'surname'], CANDIDATE_DATA.lastName);
  await sleep(400);
  
  console.log("Filling contact fields...");
  smartFill(['email', 'e-mail'], CANDIDATE_DATA.email);
  await sleep(400);
  
  smartFill(['phone', 'mobile', 'telephone', 'contact'], CANDIDATE_DATA.phone);
  await sleep(400);
  
  console.log("Filling address fields...");
  smartFill(['address', 'street', 'line'], CANDIDATE_DATA.address);
  await sleep(400);
  
  smartFill(['city', 'town'], CANDIDATE_DATA.city);
  await sleep(400);
  
  console.log("Filling dropdowns...");
  smartSelect(['country', 'nation'], CANDIDATE_DATA.country);
  await sleep(500);
  
  smartSelect(['state', 'province', 'region'], CANDIDATE_DATA.state);
  await sleep(400);
  
  console.log("Filling other fields...");
  smartFill(['linkedin', 'profile'], CANDIDATE_DATA.linkedin);
  await sleep(400);
  
  smartFill(['experience', 'years'], CANDIDATE_DATA.experience);
  await sleep(400);
  
  // Click "No" for Workday employee question
  smartClickRadio(['no']);
  await sleep(400);
  
  console.log("Auto-fill complete!");
  
  // Show success notification
  // showNotification('Form auto-filled successfully!', 'success');
}

// Show notification
function showNotification(message: string, type: 'success' | 'info' | 'error' = 'info') {
  const colors = {
    success: '#10b981',
    info: '#3b82f6',
    error: '#ef4444'
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

// Check if we're on an application form page
function isApplicationPage() {
  const url = window.location.href.toLowerCase();
  return url.includes('apply') || 
         url.includes('application') ||
         url.includes('job');
}

// Initialize
if (isApplicationPage()) {
  console.log("On application page, will auto-fill in 2 seconds...");
  //showNotification('Auto-fill will start in 2 seconds...', 'info');
  setTimeout(autoFillForm, 2000);
} else {
  console.log("Not on application page yet");
}

async function executeFullFlow() {
  console.log("\n" + "=".repeat(60));
  console.log("AUTO-APPLY PROCESS");
  console.log("=".repeat(60) + "\n");
  
  const url = window.location.href.toLowerCase();
  
  // STAGE 1: Job details page
  if (url.includes('job') && !url.includes('apply')) {
    console.log("On job details page");
    await sleep(2000);
    const clicked = await detectAndClickApplyButton();
    
    if (clicked) {
      console.log("Waiting for Apply options page...");
      await sleep(3000);
      const manuallyClicked = await detectAndClickApplyManually();
      
      if (manuallyClicked) {
        console.log("Waiting for application form to load");
      }
    }
  }
  
  // STAGE 2: Apply options page
  else if (url.includes('apply') && !url.includes('applymanually')) {
    console.log("On apply options page");
    await sleep(1000);
    const manuallyClicked = await detectAndClickApplyManually();
    
    if (manuallyClicked) {
      console.log("Waiting for application form to load");
    }
  }    
    //showNotification('Application submitted successfully!', 'success');
  }



// ============================================
// INITIALIZE
// ============================================
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', executeFullFlow);
} else {
  executeFullFlow();
}





// Watch for URL changes
let lastUrl = location.href;
new MutationObserver(() => {
  const currentUrl = location.href;
  if (currentUrl !== lastUrl) {
    lastUrl = currentUrl;
    console.log("URL changed to:", currentUrl);
    if (isApplicationPage()) {
      setTimeout(autoFillForm, 2000);
    }
  }
}).observe(document, { subtree: true, childList: true });

// Also watch for new form fields appearing (for dynamic forms)
const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    if (mutation.addedNodes.length > 0) {
      // Check if new input fields were added
      const hasNewInputs = Array.from(mutation.addedNodes).some(node => {
        if (node.nodeType === 1) {
          const element = node as Element;
          return element.querySelector('input, select, textarea') !== null;
        }
        return false;
      });
      
      if (hasNewInputs) {
        console.log("New form fields detected, re-running auto-fill...");
        setTimeout(autoFillForm, 1000);
        break;
      }
    }
  }
});

observer.observe(document.body, { 
  childList: true, 
  subtree: true 
});



