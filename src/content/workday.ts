// ============================================
// FILE: src/content/workday.ts
// COPY THIS ENTIRE CODE - REPLACE EVERYTHING
// ============================================
import type { PlasmoCSConfig } from "plasmo";
import type { CandidateData } from "../types/candidate";
import { 
  sleep, 
  fillTextInput, 
  fillSelectInput, 
  clickRadioButton, 
  uploadFile,
  fetchResumeAsFile,
  scrapeFormQuestions
} from "./utils";

export const config: PlasmoCSConfig = {
  matches: ["https://*.myworkdayjobs.com/*"],
  run_at: "document_end"
};

const DEFAULT_CANDIDATE_DATA: CandidateData = {
  status: 1,
  message: "Copilot job found",
  data: {
    seeker: {
      zip: 0,
      city: "California City",
      email: "nikhil190.ng@gmail.com",
      state: "California",
      gender: "male",
      resume: "https://mrd-live.s3.amazonaws.com/mrd-developer-resume/20250709112810USA_Nikhil_Garia_DevSecOps_Engineer_CV.pdf",
      address: "California City, CA, USA",
      country: "United States",
      last_name: "Garia",
      first_name: "Nikhil",
      mobile_num: "9702584069",
      desired_pay: 63751.30859375,
      mobile_code: "1",
      available_date: "2025-09-22",
      expected_salary: 63751.30859375,
      seeker_response: [
        {
          a: "4+ years",
          q: "what is your total experience",
          type: "number"
        }
      ],
      linkedin_profile_url: "linkedin.com/in/nikhil-garia-1st"
    },
    source: {
      country: "United States",
      apply_now_url: "https://www.indeed.com/viewjob?jk=23d5d050ced8d877"
    },
    ats_name: "Indeed",
    mongodb_id: "68ab4b5b557670953b42e7fa",
    copilot_job_id: 4409245
  }
};

async function getCandidateData(): Promise<CandidateData> {
  // For now, just return the default data
  // In production, you would load from storage or API
  return DEFAULT_CANDIDATE_DATA;
}

async function detectAndClickApplyButton() {
  const applyButtonSelectors = [
    'button[data-automation-id="apply"]',
    'a[data-automation-id="apply"]',
    'button:contains("Apply")',
    'a.css-k008qs',
    '[data-automation-id="applyNowButton"]'
  ];
  
  for (const selector of applyButtonSelectors) {
    const button = document.querySelector(selector);
    if (button) {
      console.log('Apply button found:', selector);
      (button as HTMLElement).click();
      return true;
    }
  }
  
  const buttons = Array.from(document.querySelectorAll('button, a'));
  const applyButton = buttons.find(btn => 
    btn.textContent?.toLowerCase().includes('apply')
  );
  
  if (applyButton) {
    console.log('Apply button found via text search');
    (applyButton as HTMLElement).click();
    return true;
  }
  
  return false;
}

async function fillWorkdayForm(candidateData: CandidateData) {
  await sleep(2000);
  
  const { seeker } = candidateData.data;
  
  console.log('Scraped questions:', scrapeFormQuestions());
  
  const firstNameInput = document.querySelector<HTMLInputElement>('[name*="firstName"], [name*="first"], input[data-automation-id*="firstName"]');
  if (firstNameInput) fillTextInput(firstNameInput, seeker.first_name);
  
  const lastNameInput = document.querySelector<HTMLInputElement>('[name*="lastName"], [name*="last"], input[data-automation-id*="lastName"]');
  if (lastNameInput) fillTextInput(lastNameInput, seeker.last_name);
  
  const emailInput = document.querySelector<HTMLInputElement>('[type="email"], [name*="email"]');
  if (emailInput) fillTextInput(emailInput, seeker.email);
  
  const phoneInput = document.querySelector<HTMLInputElement>('[type="tel"], [name*="phone"], [name*="mobile"]');
  if (phoneInput) fillTextInput(phoneInput, `+${seeker.mobile_code}${seeker.mobile_num}`);
  
  const addressInput = document.querySelector<HTMLInputElement>('[name*="address"], [name*="street"]');
  if (addressInput) fillTextInput(addressInput, seeker.address);
  
  const cityInput = document.querySelector<HTMLInputElement>('[name*="city"]');
  if (cityInput) fillTextInput(cityInput, seeker.city);
  
  const stateSelect = document.querySelector<HTMLSelectElement>('[name*="state"], [name*="region"]');
  if (stateSelect) fillSelectInput(stateSelect, seeker.state);
  
  const countrySelect = document.querySelector<HTMLSelectElement>('[name*="country"]');
  if (countrySelect) fillSelectInput(countrySelect, seeker.country);
  
  const linkedinInput = document.querySelector<HTMLInputElement>('[name*="linkedin"], [placeholder*="LinkedIn"]');
  if (linkedinInput) fillTextInput(linkedinInput, seeker.linkedin_profile_url);
  
  const salaryInput = document.querySelector<HTMLInputElement>('[name*="salary"], [name*="compensation"]');
  if (salaryInput) fillTextInput(salaryInput, seeker.expected_salary.toString());
  
  const dateInput = document.querySelector<HTMLInputElement>('[type="date"], [name*="available"], [name*="start"]');
  if (dateInput) fillTextInput(dateInput, seeker.available_date);
  
  if (seeker.gender) {
    clickRadioButton('gender', seeker.gender);
  }
  
  const fileInput = document.querySelector<HTMLInputElement>('[type="file"]');
  if (fileInput && seeker.resume) {
    const resumeFile = await fetchResumeAsFile(seeker.resume);
    if (resumeFile) {
      await uploadFile(fileInput, resumeFile);
    }
  }
  
  for (const response of seeker.seeker_response) {
    const questionText = response.q.toLowerCase();
    const inputs = document.querySelectorAll('input, select, textarea');
    
    for (const input of inputs) {
      const label = input.closest('label')?.textContent?.toLowerCase() || 
                   document.querySelector(`label[for="${input.id}"]`)?.textContent?.toLowerCase() || '';
      
      if (label.includes(questionText) || label.includes('experience')) {
        if (input.tagName === 'SELECT') {
          fillSelectInput(input as HTMLSelectElement, response.a);
        } else if (input.tagName === 'INPUT') {
          fillTextInput(input as HTMLInputElement, response.a);
        }
        break;
      }
    }
  }
  
  await sleep(1000);
  
  const submitButton = document.querySelector<HTMLButtonElement>('[type="submit"], button[data-automation-id*="submit"]');
  if (submitButton) {
    console.log('Submitting form...');
    submitButton.click();
  }
}

(async () => {
  console.log('Workday auto-apply script loaded');
  
  await sleep(2000);
  
  const clicked = await detectAndClickApplyButton();
  
  if (clicked) {
    console.log('Apply button clicked, waiting for form...');
    await sleep(3000);
    
    const candidateData = await getCandidateData();
    await fillWorkdayForm(candidateData);
  }
})();