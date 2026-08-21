export interface User {
  id: string;
  username: string;
  email?: string;
  role: "user" | "admin";
  status?: "active" | "inactive";
  avatar?: string;
}

export interface LoginResponse {
  accessToken: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  username: string;
  password: string;
}