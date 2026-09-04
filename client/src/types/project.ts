export type ProjectStatus = "active" | "inactive";

export interface Project {
  _id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  owner: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetProjectsParams {
  page?: number;
  limit?: number;
}

export interface GetProjectsResponse {
  projects: Project[];
  currentPage: number;
  totalPages: number;
  totalProjects: number;
  limit: number;
}

export interface CreateProjectData {
  title: string;
  description: string;
}

export interface UpdateProjectData {
  title?: string;
  description?: string;
  status?: ProjectStatus;
}