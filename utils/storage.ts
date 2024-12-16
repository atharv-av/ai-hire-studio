import secureLocalStorage from "react-secure-storage";

export const KEYS = {
  USER: "hr_app@user",
  TEST_DATA: "hr_app@test",
};

interface User {
  isAuth: boolean;
  id: number;
  firstName: string;
  lastName: string;
  token: string;
}

interface TestData {
  questions?: number;
  status?: string;
  duration?: string;
  id: number;
  module_api: string;
  module_name: string;
  company_name: string;
  test_identifier: string;
}

// Helper function to safely parse JSON
const parseJSON = <T>(value: string | null): T | null => {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch (error) {
    console.error("Failed to parse storage item", error);
    return null;
  }
};

export const getUser = (): User | null => {
  const user = secureLocalStorage.getItem(KEYS.USER) as string | null;
  return parseJSON<User>(user);
};

export const setUser = (user: User): void => {
  secureLocalStorage.setItem(KEYS.USER, JSON.stringify(user));
};

export const removeUser = (): void => {
  secureLocalStorage.removeItem(KEYS.USER);
  secureLocalStorage.removeItem(KEYS.TEST_DATA);
};

export const setTestData = (data: TestData): void => {
  secureLocalStorage.setItem(KEYS.TEST_DATA, JSON.stringify(data));
};

export const getTestData = (): TestData => {
  const data = secureLocalStorage.getItem(KEYS.TEST_DATA) as string | null;
  return (
    parseJSON<TestData>(data) || {
      id: 1,
      module_api: "https://newapi.aihirestudio.com/quiz/Human Resource",
      module_name: "Human Resource",
      company_name: "HOC",
      test_identifier: "none",
    }
  );
};

export const getUserData = (): { [key: string]: any } | null => {
  const userDataKey = "user_data"; // adjust the key if needed
  const storedData = localStorage.getItem(userDataKey);
  if (storedData) {
    return JSON.parse(storedData); // parse the stored JSON string
  } else {
    return null; // return null if no data is found
  }
};
