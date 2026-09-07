import api from "./api";

import type {
  UserProfile as Profile,
  UpdatePasswordData,
  UpdateProfileData,
} from "../types/auth";

export const getMyProfile = async (): Promise<Profile> => {
  const response = await api.get<Profile>("/users/me");

  return response.data;
};

export const updateMyProfile = async (
  data: UpdateProfileData
): Promise<Profile> => {
  const response = await api.patch<Profile>("/users/me", data);

  return response.data;
};

export const updateMyPassword = async (
  data: UpdatePasswordData
): Promise<{ message: string }> => {
  const response = await api.patch<{ message: string }>(
    "/users/password",
    data
  );

  return response.data;
};