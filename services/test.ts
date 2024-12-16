import { ResultItem, Test, Question, TestData } from "@/types/test";
import { getUser } from "@/utils/storage";
import axios from "axios";
import * as secureStorage from "@/utils/storage";
import { processResponseAPI } from "./responses";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const getTests = async (): Promise<Test[]> => {
  const user = getUser()
  try {
    const response = await axios.get(`${apiUrl}/user/tests`, {
      headers:{Authorization:`Bearer ${user?.token}`}
    });
    return response.data.tests;
  } catch (error) {
    console.error("Error fetching tests:", error);
    return [];
  }
};

export const getResults = async (): Promise<ResultItem[]> => {
  try {
    const response = await axios.get(`${apiUrl}/user/score_history_data/`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch results"
      );
    }
    throw new Error("An unexpected error occurred");
  }
};

export const getFileCounts = async (): Promise<number> => {
  const user = getUser();
  if (!user) {
    throw new Error("User not authenticated.");
  }

  const { token, id } = user;

  try {
    const { data } = await axios.get(`${apiUrl}/count_files/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const fileCount = parseInt(data.message, 10);
    return isNaN(fileCount) ? 0 : fileCount;
  } catch (error) {
    console.error("Error fetching file counts:", error);
    return 0;
  }
};

export const deleteVideoFiles = async (): Promise<any> => {
  const user = getUser();
  if (!user) {
    throw new Error("User not authenticated.");
  }

  const { token, id } = user;

  try {
    const { data } = await axios.get(`${apiUrl}/delete_files/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    console.error("Error deleting video files:", error);
    throw new Error("Failed to delete video files.");
  }
};

// Fetch quiz questions by quiz ID
export const getQuestions = async (module: string): Promise<Question[]> => {
  try {
    const response = await axios.get(`${apiUrl}/quiz/${module}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching questions:", error);
    return [];
  }
};

// Fetch answer time configuration for quizzes
export const getAnswerTime = async () => {
  const user = getUser();
  // if (!user) {
  //   throw new Error("User not authenticated.");
  // } 
  
  try {
    const response = await axios.get(`${apiUrl}/quiz/answer_time`, {
      headers: {
        Authorization: `Bearer ${user?.token}`,
      },
    });
    console.log(user?.token)
    return response.data;
  } catch (error) {
    console.error("Error fetching answer time:", error);
  }
};

export const endQuiz = async (quizId: number): Promise<void> => {
  const user = getUser();
  if (!user) {
    throw new Error("User not authenticated.");
  }

  const { token } = user;

  try {
    console.log(`Ending quiz with ID: ${quizId} for user with token: ${token}`);
    // window.location.href = "/tests";
  } catch (error) {
    console.error("Error ending quiz:", error);
  }
};

export const getTestIdentifierData = async (
  testIdentifier: string
): Promise<TestData | null> => {
  const { data } = await axios.get(
    `${apiUrl}/corporate/get_test/${testIdentifier}`
  );
  return data?.data[0] || null;
};

export const getTestsList = async (id: number) => {
  const { data } = await axios.get(`${apiUrl}/corporate/get_all_tests/${id}`);
  return data;
};

export const getAllModules = async () => {
  const { data } = await axios.get(`${apiUrl}/get/modules`);
  return data.data;
};

export const updateTestStatus = async (id: number, test_id: string) => {
  const { data } = await axios.get(
    `${apiUrl}/corporate/update_test_status/${id}/${test_id}`
  );
  return data;
};

export const createTest = async (
  id: number,
  corp_name: string,
  module_name: string
) => {
  const { data } = await axios.post(`${apiUrl}/corporate/create_test`, {
    corp_user_id: id,
    company_name: corp_name,
    module_name,
  });
  return data?.data;
};

export const getResultsList = async (test_id: string) => {
  const { data } = await axios.get(
    `${apiUrl}/corporate/score_history_data/${test_id}`
  );
  return data;
};
