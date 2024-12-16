import axios from "axios";
import * as secureStorage from "@/utils/storage";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

interface SaveResponseBody {
  questionId: number;
  selectedOptionId: number;
}

export const saveResponse = async (
  body: SaveResponseBody = { questionId: 0, selectedOptionId: 0 }
): Promise<void> => {
  // const { token } = secureStorage.getUser();
  // await axios.post(`/responses`, body, {
  //   headers: {
  //     Authorization: "Bearer " + token,
  //   },
  // });
};

export const saveAudioRecAPI = async (fd: FormData): Promise<void> => {
  const user = secureStorage.getUser();
  if (!user) throw new Error("User not authenticated.");

  await axios.post(`${apiUrl}/user/user-responses/audio`, fd, {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  });
};

export const saveVideoRecAPI = async (fd: FormData): Promise<void> => {
  const user = secureStorage.getUser();
  if (!user) throw new Error("User not authenticated.");

  await axios.post(`${apiUrl}/user/user-responses/video`, fd, {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  });
};

export const processResponseAPI = async (): Promise<any> => {
  const user = secureStorage.getUser();
  const testData = secureStorage.getTestData();

  if (!user || !testData) throw new Error("User or test data not found.");

  console.log('Processing test with params:', {
    userId: user.id,
    companyName: testData.company_name,
    testId: testData.test_identifier
  });

  const { data } = await axios.get(
    `${apiUrl}/user/score_generator/${user.id}/${testData.company_name}/${testData.test_identifier}`,
    {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    }
  );

  return data;
};

export const getResult = async (): Promise<string> => {
  const user = secureStorage.getUser();
  if (!user) throw new Error("User not authenticated.");

  const { data } = await axios.get(
    `${apiUrl}/share_data/${encodeURIComponent(user.id)}`,
    {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    }
  );

  return data.message;
};

export const getScores = async (): Promise<any> => {
  const user = secureStorage.getUser();
  if (!user) throw new Error("User not authenticated.");

  const { data } = await axios.get(
    `${apiUrl}/user/score_history_data/${encodeURIComponent(user.id)}`,
    {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    }
  );

  return data.data;
};
