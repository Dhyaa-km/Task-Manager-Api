import api from "./api";

import type {
  CreateProjectData,
  GetProjectsParams,
  GetProjectsResponse,
  Project,
  UpdateProjectData,
} from "../types/project";

export const getAllProjects = async (
  params: GetProjectsParams = {}
): Promise<GetProjectsResponse> => {
  const response = await api.get<GetProjectsResponse>("/projects", {
    params,
  });

  return response.data;
};

export const getProjectById = async (
  projectId: string
): Promise<Project> => {
  const response = await api.get<Project>(
    `/projects/${projectId}`
  );

  return response.data;
};

export const createProject = async (
  data: CreateProjectData
): Promise<Project> => {
  const response = await api.post<Project>(
    "/projects",
    data
  );

  return response.data;
};

export const updateProject = async (
  projectId: string,
  data: UpdateProjectData
): Promise<Project> => {
  const response = await api.patch<Project>(
    `/projects/${projectId}`,
    data
  );

  return response.data;
};

export const deleteProject = async (
  projectId: string
): Promise<void> => {
  await api.delete(`/projects/${projectId}`);
};
