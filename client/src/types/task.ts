export type TaskStatus = "todo" | "in-progress" | "done";

export type TaskPriority = "low" | "medium" | "high";

export type TaskSort = "createdAt" | "dueDate" | "title";

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  user: string;
  project: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetTasksParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: TaskStatus;
  sort?: TaskSort;
}

export interface GetTasksResponse {
  tasks: Task[];
  currentPage: number;
  totalPages: number;
  totalTasks: number;
  limit: number;
}

export interface CreateTaskData {
  title: string;
  description: string;
  status?: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
}