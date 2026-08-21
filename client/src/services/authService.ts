import api from "./api";
import type {
  LoginData,
  LoginResponse,
  RegisterData,
} from "../types/auth";

export const registerUser = async (data: RegisterData) => {
  const response = await api.post("/auth/register", data);

  return response.data;
};

export const loginUser = async (
  data: LoginData
): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>("/auth/login", data);

  return response.data;
};

export const refreshAccessToken = async (): Promise<LoginResponse> => {
  const response = await api.get<LoginResponse>("/auth/refresh");

  return response.data;
};

export const logoutUser = async () => {
  const response = await api.get("/auth/logout");

  return response.data;
};