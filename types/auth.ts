export type LoginFormData = {
  email: string;
  password: string;
};

export type AuthResponse = {
  success: boolean;
  token: string;
  user_data: {
    id: number;
    firstName: string;
    lastName: string;
  };
};

export type APIErrorResponse = {
  message?: string;
};

export type RegisterFormData = {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
};

export type CorpUserData = {
  firstName: string;
  lastName: string;
  corpName: string;
  email: string;
  id: number | string;
};

export type LoginResponse = {
  corp_user_data: CorpUserData;
  token: string;
};

export type CorpLoginFormData = {
  corp_email: string;
  password: string;
};

export type CorporateRegisterData = {
  corp_email: string;
  corp_first_name: string;
  corp_last_name: string;
  password: string;
  corp_job_tile: string;
  corp_corp_name: string;
  corp_emp_size: string;
  corp_phone_no: string;
  corp_region: string;
};

export type RegisterResponse = {
  token: string;
  corp_user_data: {
    id: string;
    firstName: string;
    lastName: string;
  };
};
