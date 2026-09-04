import api from "./api";

import type {
  CreateTaskData,
  GetTasksParams,
  GetTasksResponse,
  Task,
  UpdateTaskData,
} from "../types/task";

export const getAllTasks = async (
  projectId: string,
  params: GetTasksParams = {}
): Promise<GetTasksResponse> => {
  const response = await api.get<GetTasksResponse>(
    `/projects/${projectId}/tasks`,
    {
      params,
    }
  );

  return response.data;
};

export const getTaskById = async (
  taskId: string
): Promise<Task> => {
  const response = await api.get<Task>(
    `/tasks/${taskId}`
  );

  return response.data;
};

export const createTask = async (
  projectId: string,
  data: CreateTaskData
): Promise<Task> => {
  const response = await api.post<Task>(
    `/projects/${projectId}/tasks`,
    data
  );

  return response.data;
};

export const updateTask = async (
  taskId: string,
  data: UpdateTaskData
): Promise<Task> => {
  const response = await api.patch<Task>(
    `/tasks/${taskId}`,
    data
  );

  return response.data;
};

export const deleteTask = async (
  taskId: string
): Promise<void> => {
  await api.delete(`/tasks/${taskId}`);
};