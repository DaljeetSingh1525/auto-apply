// ============================================
// FILE: src/content/ziprecruiter.ts
// COPY THIS ENTIRE CODE - REPLACE EVERYTHING
// ============================================
import type { PlasmoCSConfig } from "plasmo";
import type { CandidateData } from "../types/candidate";
import { 
  sleep, 
  fillTextInput, 
  fillSelectInput, 
  uploadFile,
  fetchResumeAsFile,
  scrapeFormQuestions
} from "./utils";

export const config: PlasmoCSConfig = {
  matches: ["https://*.smartrecruiters.com/*"],
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
  return DEFAULT_CANDIDATE_DATA;
}

async function detectAndClickApplyButton() {
  const applyButtonSelectors = [
    'button.apply-button',
    'a.apply-button',
    '[data-test="apply-button"]',
    'button:contains("Apply")'
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

async function fillSmartRecruitersForm(candidateData: CandidateData) {
  await sleep(2000);
  
  const { seeker } = candidateData.data;
  
  console.log('Scraped questions:', scrapeFormQuestions());
  
  const firstNameInput = document.querySelector<HTMLInputElement>('[name="firstName"], #firstName');
  if (firstNameInput) fillTextInput(firstNameInput, seeker.first_name);
  
  const lastNameInput = document.querySelector<HTMLInputElement>('[name="lastName"], #lastName');
  if (lastNameInput) fillTextInput(lastNameInput, seeker.last_name);
  
  const emailInput = document.querySelector<HTMLInputElement>('[name="email"], #email');
  if (emailInput) fillTextInput(emailInput, seeker.email);
  
  const phoneInput = document.querySelector<HTMLInputElement>('[name="phoneNumber"], #phoneNumber');
  if (phoneInput) fillTextInput(phoneInput, `+${seeker.mobile_code}${seeker.mobile_num}`);
  
  const linkedinInput = document.querySelector<HTMLInputElement>('[name="linkedin"]');
  if (linkedinInput) fillTextInput(linkedinInput, seeker.linkedin_profile_url);
  
  const fileInput = document.querySelector<HTMLInputElement>('input[type="file"]');
  if (fileInput && seeker.resume) {
    const resumeFile = await fetchResumeAsFile(seeker.resume);
    if (resumeFile) {
      await uploadFile(fileInput, resumeFile);
    }
  }
  
  await sleep(1000);
  
  const submitButton = document.querySelector<HTMLButtonElement>('button[type="submit"]');
  if (submitButton) {
    console.log('Submitting form...');
    submitButton.click();
  }
}

(async () => {
  console.log('SmartRecruiters auto-apply script loaded');
  
  await sleep(2000);
  
  const clicked = await detectAndClickApplyButton();
  
  if (clicked) {
    console.log('Apply button clicked, waiting for form...');
    await sleep(3000);
    
    const candidateData = await getCandidateData();
    await fillSmartRecruitersForm(candidateData);
  }
})();