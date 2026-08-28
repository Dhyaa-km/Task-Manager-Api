import api from "./api";

import type {
  AdminUserDetails,
  GetUsersParams,
  GetUsersResponse,
  UpdateUserData
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

export const updateUserById = async (
  userId: string,
  data: UpdateUserData
): Promise<AdminUserDetails> => {
  const response = await api.patch<AdminUserDetails>(
    `/users/${userId}`,
    data
  );

  return response.data;
};

export const deleteUser = async (
  userId: string
): Promise<void> => {
  await api.delete(`/users/${userId}`);
};