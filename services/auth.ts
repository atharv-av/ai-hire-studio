import {
  APIErrorResponse,
  AuthResponse,
  CorpLoginFormData,
  CorporateRegisterData,
  LoginFormData,
  LoginResponse,
  RegisterFormData,
  RegisterResponse,
} from "@/types/auth";
import axios, { AxiosError } from "axios";

export const registerUser = async (
  data: RegisterFormData
): Promise<AuthResponse> => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/user/register`,
      data
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw new Error(axiosError.message || "Something went wrong");
  }
};

export const loginUser = async (data: LoginFormData): Promise<AuthResponse> => {
  try {
    const response = await axios.post<AuthResponse>(
      `${process.env.NEXT_PUBLIC_API_URL}/user/login`,
      data
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<APIErrorResponse>;
    if (axiosError.response?.data) {
      throw new Error(axiosError.response.data.message || "Login failed");
    }
    throw new Error(axiosError.message || "Something went wrong");
  }
};

export const authService = {
  async login(credentials: CorpLoginFormData): Promise<LoginResponse> {
    try {
      const { data } = await axios.post<LoginResponse>(
        `${process.env.NEXT_PUBLIC_API_URL}/corporate/login`,
        credentials
      );
      return data;
    } catch (error) {
      throw error;
    }
  },
};

export const registerCorporate = async (data: CorporateRegisterData): Promise<RegisterResponse> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/corporate/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Registration failed');
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('An unexpected error occurred');
  }
};