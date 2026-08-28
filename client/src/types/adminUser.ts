export interface AdminUser {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
  status: "active" | "inactive";
  createdAt: string;
}

export interface GetUsersParams {
  page?: number;
  limit?: number;
  status?: "active" | "inactive";
}

export interface GetUsersResponse {
  users: AdminUser[];
  currentPage: number;
  totalPages: number;
  totalUsers: number;
  limit: number;
}

export interface AdminUserDetails {
  username: string;
  email: string;
  avatar?: string;
  status: "active" | "inactive";
  role: "user" | "admin";
  createdAt: string;
}
