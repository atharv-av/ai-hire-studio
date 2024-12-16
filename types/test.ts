export type Test = {
  id: string;
  module_name: string;
  description?: string;
  duration: string;
  questions: number;
  status: "completed" | "pending";
  score?: number;
  completedAt?: string;
};

export type ResultItem = {
  id: string;
  company_name: string;
  module_name: string;
  total_score: number;
  model_prediction: string;
  created_at: string;
  user_id: string;
};

export type Question = {
  id: number;
  question: string;
  info?: string;
  options: {
    id: number;
    text: string;
  }[];
};

export type TestData = {
  id: number;
  module_api: string;
  company_name: string;
  test_identifier: string;
  module_name: string;
  status: string;
};
