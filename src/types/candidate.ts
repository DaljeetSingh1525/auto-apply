export interface SeekerResponse {
  q: string;
  a: string;
  type: string;
}

export interface Seeker {
  zip: number;
  city: string;
  email: string;
  state: string;
  gender: string;
  resume: string;
  address: string;
  country: string;
  last_name: string;
  first_name: string;
  mobile_num: string;
  desired_pay: number;
  mobile_code: string;
  available_date: string;
  expected_salary: number;
  seeker_response: SeekerResponse[];
  linkedin_profile_url: string;
}

export interface Source {
  country: string;
  apply_now_url: string;
}

export interface CandidateData {
  status: number;
  message: string;
  data: {
    seeker: Seeker;
    source: Source;
    ats_name: string;
    mongodb_id: string;
    copilot_job_id: number;
  };
}