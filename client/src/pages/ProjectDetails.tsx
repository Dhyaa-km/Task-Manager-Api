import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  CircleDot,
  Clock3,
  Edit3,
  FolderKanban,
  ListTodo,
  Plus,
  Search,
  Trash2,
} from "lucide-react";

import {
  deleteProject,
  getProjectById,
} from "../services/projectService";
import {
  deleteTask,
  getAllTasks,
} from "../services/taskService";

import type { Project } from "../types/project";
import type {
  Task,
  TaskSort,
  TaskStatus,
} from "../types/task";

function ProjectDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [tasks, setTasks] = useState<Task[]>([]);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [tasksError, setTasksError] = useState("");

  const [taskPage, setTaskPage] = useState(1);
  const [taskTotalPages, setTaskTotalPages] = useState(1);

  const [taskSearch, setTaskSearch] = useState("");
  const [taskStatus, setTaskStatus] =
    useState<TaskStatus | "">("");
  const [taskSort, setTaskSort] =
    useState<TaskSort>("createdAt");

  const taskLimit = 10;

  // ================================
  // Fetch Project
  // ================================

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) {
        setError("Project ID is missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const data = await getProjectById(id);

        setProject(data);
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
            "Failed to load project."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  // ================================
  // Fetch Tasks
  // ================================

  const fetchTasks = async (page: number) => {
    if (!id) return;

    try {
      setTasksLoading(true);
      setTasksError("");

      const data = await getAllTasks(id, {
        page,
        limit: taskLimit,
        search: taskSearch || undefined,
        status: taskStatus || undefined,
        sort: taskSort,
      });

      setTasks(data.tasks);
      setTaskPage(data.currentPage);
      setTaskTotalPages(data.totalPages);
    } catch (err: any) {
      setTasksError(
        err.response?.data?.message ||
          "Failed to load tasks."
      );
    } finally {
      setTasksLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks(taskPage);
  }, [id, taskPage, taskStatus, taskSort]);

  // ================================
  // Task Search
  // ================================

  const handleTaskSearch = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setTaskPage(1);
    fetchTasks(1);
  };

  // ================================
  // Delete Task
  // ================================

  const handleDeleteTask = async (taskId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setTasksError("");

      await deleteTask(taskId);

      if (tasks.length === 1 && taskPage > 1) {
        setTaskPage((page) => page - 1);
      } else {
        fetchTasks(taskPage);
      }
    } catch (err: any) {
      setTasksError(
        err.response?.data?.message ||
          "Failed to delete task."
      );
    }
  };

  // ================================
  // Delete Project
  // ================================

  const handleDelete = async () => {
    if (!id) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteProject(id);

      navigate("/projects");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to delete project."
      );
    }
  };

  // ================================
  // Loading
  // ================================

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600" />

          <p className="text-sm text-gray-500">
            Loading project...
          </p>
        </div>
      </div>
    );
  }

  // ================================
  // Project Error
  // ================================

  if (error && !project) {
    return (
      <div className="mx-auto max-w-5xl">
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-indigo-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </Link>

        <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

          <p className="text-sm font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-gray-500">
          Project not found.
        </p>
      </div>
    );
  }

  // ================================
  // Render
  // ================================

  return (
    <div className="mx-auto max-w-7xl">
      {/* Back */}
      <Link
        to="/projects"
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-indigo-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Projects
      </Link>

      {/* Project Header */}
      <div className="mt-5 rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <FolderKanban className="h-6 w-6" />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="break-words text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                  {project.title}
                </h1>

                <span
                  className={`ui-badge ${
                    project.status === "active"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <span
                    className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
                      project.status === "active"
                        ? "bg-emerald-500"
                        : "bg-gray-400"
                    }`}
                  />

                  {project.status}
                </span>
              </div>

              <p className="mt-2 text-sm text-gray-500">
                Project overview and task management.
              </p>
            </div>
          </div>

          {/* Project Actions */}
          <div className="flex w-full gap-2 lg:w-auto">
            <Link
              to={`/projects/${project._id}/edit`}
              className="ui-button-secondary flex-1 gap-2 lg:flex-none"
            >
              <Edit3 className="h-4 w-4" />
              Edit
            </Link>

            <button
              onClick={handleDelete}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-100 lg:flex-none"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </div>
        </div>

        {/* Project Error */}
        {error && (
          <div className="mt-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Description */}
        <div className="mt-6 border-t border-gray-100 pt-6">
          <h2 className="text-sm font-semibold text-gray-900">
            Description
          </h2>

          <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-gray-600">
            {project.description ||
              "No description provided."}
          </p>
        </div>

        {/* Project Information */}
        <div className="mt-6 grid gap-4 border-t border-gray-100 pt-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-gray-50 p-4">
            <div className="flex items-center gap-2 text-gray-500">
              <CircleDot className="h-4 w-4" />

              <p className="text-xs font-medium">
                Status
              </p>
            </div>

            <p className="mt-2 font-semibold capitalize text-gray-900">
              {project.status}
            </p>
          </div>

          <div className="rounded-lg bg-gray-50 p-4">
            <div className="flex items-center gap-2 text-gray-500">
              <CalendarDays className="h-4 w-4" />

              <p className="text-xs font-medium">
                Created
              </p>
            </div>

            <p className="mt-2 font-semibold text-gray-900">
              {new Date(
                project.createdAt
              ).toLocaleDateString(undefined, {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>

          <div className="rounded-lg bg-gray-50 p-4">
            <div className="flex items-center gap-2 text-gray-500">
              <Clock3 className="h-4 w-4" />

              <p className="text-xs font-medium">
                Last Updated
              </p>
            </div>

            <p className="mt-2 font-semibold text-gray-900">
              {new Date(
                project.updatedAt
              ).toLocaleDateString(undefined, {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>

          <div className="rounded-lg bg-gray-50 p-4">
            <div className="flex items-center gap-2 text-gray-500">
              <FolderKanban className="h-4 w-4" />

              <p className="text-xs font-medium">
                Project ID
              </p>
            </div>

            <p
              className="mt-2 truncate font-mono text-xs text-gray-900"
              title={project._id}
            >
              {project._id}
            </p>
          </div>
        </div>
      </div>

      {/* Tasks Section */}
      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        {/* Tasks Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <ListTodo className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Tasks
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Manage the tasks belonging to this project.
              </p>
            </div>
          </div>

          <Link
            to={`/projects/${project._id}/tasks/new`}
            className="ui-button-primary w-full gap-2 sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            Create Task
          </Link>
        </div>

        {/* Search + Filters */}
        <div className="mt-6 grid gap-3 lg:grid-cols-[1fr_auto_auto]">
          <form
            onSubmit={handleTaskSearch}
            className="flex gap-2"
          >
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

              <input
                type="text"
                value={taskSearch}
                onChange={(e) =>
                  setTaskSearch(e.target.value)
                }
                placeholder="Search tasks by title..."
                className="ui-input pl-9"
              />
            </div>

            <button
              type="submit"
              className="ui-button-secondary px-4"
            >
              Search
            </button>
          </form>

          <select
            value={taskStatus}
            onChange={(e) => {
              setTaskStatus(
                e.target.value as TaskStatus | ""
              );
              setTaskPage(1);
            }}
            className="ui-input lg:w-40"
          >
            <option value="">All statuses</option>
            <option value="todo">Todo</option>
            <option value="in-progress">
              In Progress
            </option>
            <option value="done">Done</option>
          </select>

          <select
            value={taskSort}
            onChange={(e) => {
              setTaskSort(e.target.value as TaskSort);
              setTaskPage(1);
            }}
            className="ui-input lg:w-36"
          >
            <option value="createdAt">Newest</option>
            <option value="dueDate">Due Date</option>
            <option value="title">Title</option>
          </select>
        </div>

        {/* Task Error */}
        {tasksError && (
          <div className="mt-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

            <p className="text-sm font-medium">
              {tasksError}
            </p>
          </div>
        )}

        {/* Task Loading */}
        {tasksLoading ? (
          <div className="flex min-h-60 items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-3 h-7 w-7 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600" />

              <p className="text-sm text-gray-500">
                Loading tasks...
              </p>
            </div>
          </div>
        ) : tasks.length === 0 ? (
          /* Empty Tasks */
          <div className="mt-6 rounded-xl border border-dashed border-gray-300 px-6 py-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-gray-50 text-gray-400">
              <ListTodo className="h-7 w-7" />
            </div>

            <h3 className="mt-4 text-base font-semibold text-gray-900">
              No tasks found
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              {taskSearch || taskStatus
                ? "Try changing your search or filters."
                : "This project doesn't have any tasks yet."}
            </p>

            {!taskSearch && !taskStatus && (
              <Link
                to={`/projects/${project._id}/tasks/new`}
                className="ui-button-primary mt-5 gap-2"
              >
                <Plus className="h-4 w-4" />
                Create your first task
              </Link>
            )}
          </div>
        ) : (
          <>
            {/* Tasks */}
            <div className="mt-6 space-y-3">
              {tasks.map((task) => (
                <div
                  key={task._id}
                  className="rounded-xl border border-gray-200 p-4 transition hover:border-indigo-200 hover:shadow-sm"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    {/* Task Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="wrap-break-word text-base font-semibold text-gray-900">
                          {task.title}
                        </h3>

                        {/* Status */}
                        <span
                          className={`ui-badge ${
                            task.status === "done"
                              ? "bg-emerald-50 text-emerald-700"
                              : task.status ===
                                "in-progress"
                              ? "bg-violet-50 text-violet-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {task.status === "done" ? (
                            <CircleCheck className="mr-1.5 h-3.5 w-3.5" />
                          ) : (
                            <CircleDot className="mr-1.5 h-3.5 w-3.5" />
                          )}

                          {task.status === "in-progress"
                            ? "In Progress"
                            : task.status}
                        </span>

                        {/* Priority */}
                        <span
                          className={`ui-badge ${
                            task.priority === "high"
                              ? "bg-red-50 text-red-700"
                              : task.priority === "medium"
                              ? "bg-orange-50 text-orange-700"
                              : "bg-blue-50 text-blue-700"
                          }`}
                        >
                          {task.priority}
                        </span>
                      </div>

                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-600">
                        {task.description ||
                          "No description provided."}
                      </p>

                      <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                        <CalendarDays className="h-3.5 w-3.5" />

                        <span>
                          Due{" "}
                          {new Date(
                            task.dueDate
                          ).toLocaleDateString(undefined, {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Task Actions */}
                    <div className="flex w-full gap-2 lg:w-auto">
                      <Link
                        to={`/tasks/${task._id}`}
                        className="ui-button-primary flex-1 lg:flex-none"
                      >
                        View
                      </Link>

                      <Link
                        to={`/tasks/${task._id}/edit`}
                        className="ui-button-secondary px-3"
                        title="Edit task"
                        aria-label={`Edit ${task.title}`}
                      >
                        <Edit3 className="h-4 w-4" />
                      </Link>

                      <button
                        onClick={() =>
                          handleDeleteTask(task._id)
                        }
                        className="inline-flex items-center justify-center rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-100"
                        title="Delete task"
                        aria-label={`Delete ${task.title}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {taskTotalPages > 1 && (
              <div className="mt-6 flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                <button
                  onClick={() =>
                    setTaskPage((page) => page - 1)
                  }
                  disabled={taskPage === 1}
                  className="ui-button-secondary gap-2 px-3 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" />

                  <span className="hidden sm:inline">
                    Previous
                  </span>
                </button>

                <span className="text-sm font-medium text-gray-600">
                  Page{" "}
                  <span className="text-gray-900">
                    {taskPage}
                  </span>{" "}
                  of {taskTotalPages}
                </span>

                <button
                  onClick={() =>
                    setTaskPage((page) => page + 1)
                  }
                  disabled={
                    taskPage === taskTotalPages
                  }
                  className="ui-button-secondary gap-2 px-3 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className="hidden sm:inline">
                    Next
                  </span>

                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ProjectDetails;