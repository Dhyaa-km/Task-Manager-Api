import api from "./api";
import type { DashboardStats } from "../types/dashboard";

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await api.get<DashboardStats>(
    "/users/dashboard"
  );

  return response.data;
};