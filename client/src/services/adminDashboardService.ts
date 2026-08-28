import api from "./api";
import type { AdminDashboardStats } from "../types/adminDashboard";

export const getAdminDashboardStats =
  async (): Promise<AdminDashboardStats> => {
    const response = await api.get<AdminDashboardStats>(
      "/admin/dashboard"
    );

    return response.data;
  };