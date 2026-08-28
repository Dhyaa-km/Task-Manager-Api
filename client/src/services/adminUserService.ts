import api from "./api";

import type {
  AdminUserDetails,
  GetUsersParams,
  GetUsersResponse,
} from "../types/adminUser";


export const getAllUsers = async (
  params: GetUsersParams = {}
): Promise<GetUsersResponse> => {
  const response = await api.get<GetUsersResponse>("/users", {
    params,
  });

  return response.data;
};

export const getUserById = async (
  userId: string
): Promise<AdminUserDetails> => {
  const response = await api.get<AdminUserDetails>(
    `/users/${userId}`
  );

  return response.data;
};