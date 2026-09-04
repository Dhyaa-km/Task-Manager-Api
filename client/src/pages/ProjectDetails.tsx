import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteProject, getProjectById, } from "../services/projectService";
import { deleteTask, getAllTasks, } from "../services/taskService";
import type { Project } from "../types/project";
import type { Task, TaskSort, TaskStatus, } from "../types/task";

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
  const [taskStatus, setTaskStatus] = useState<TaskStatus | "">("");
  const [taskSort, setTaskSort] = useState<TaskSort>("createdAt");

  const taskLimit = 10;

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
          err.response?.data?.message || "Failed to load project."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);


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

  const handleTaskSearch = (e: React.FormEvent<HTMLFormElement>) =>
  {
    e.preventDefault();
    setTaskPage(1);
    fetchTasks(1);
  };


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

      // If the last task on the current page was deleted,
      // go back one page.
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
        err.response?.data?.message || "Failed to delete project."
      );
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Loading project...</p>
      </div>
    );
  }

  if (error && !project) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="mx-auto max-w-4xl">
          <Link
            to="/projects"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            ← Back to Projects
          </Link>

          <div className="mt-6 rounded-xl bg-red-100 p-5 text-red-700">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Project not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-4xl">
        {/* Back */}
        <Link
          to="/projects"
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          ← Back to Projects
        </Link>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-lg bg-red-100 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Project */}
        <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">
          {/* Header */}
          <div className="flex flex-col gap-4 border-b border-gray-200 pb-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-gray-900">
                  {project.title}
                </h1>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    project.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {project.status}
                </span>
              </div>

              <p className="mt-2 text-sm text-gray-500">
                Project details
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Link
                to={`/projects/${project._id}/edit`}
                className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-300"
              >
                Edit
              </Link>

              <button
                onClick={handleDelete}
                className="rounded-lg bg-red-100 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-200"
              >
                Delete
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="py-6">
            <h2 className="mb-2 text-lg font-semibold text-gray-900">
              Description
            </h2>

            <p className="whitespace-pre-wrap leading-7 text-gray-600">
              {project.description}
            </p>
          </div>

          {/* Project information */}
          <div className="grid gap-4 border-t border-gray-200 pt-6 sm:grid-cols-2">
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="mt-1 font-medium capitalize text-gray-900">
                {project.status}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Created</p>
              <p className="mt-1 font-medium text-gray-900">
                {new Date(project.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Last updated</p>
              <p className="mt-1 font-medium text-gray-900">
                {new Date(project.updatedAt).toLocaleDateString()}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Project ID</p>
              <p className="mt-1 break-all font-mono text-sm text-gray-900">
                {project._id}
              </p>
            </div>
          </div>
        </div>

       
{/* Tasks section */}
<div className="mt-6 rounded-xl bg-white p-6 shadow-sm">
  {/* Header */}
  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h2 className="text-xl font-bold text-gray-900">
        Tasks
      </h2>

      <p className="mt-1 text-sm text-gray-500">
        Manage the tasks belonging to this project.
      </p>
    </div>

    <Link
      to={`/projects/${project._id}/tasks/new`}
      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
    >
      + Create Task
    </Link>
  </div>

  {/* Search + Filters */}
  <div className="mt-6 flex flex-col gap-3 lg:flex-row">
    {/* Search */}
    <form
      onSubmit={handleTaskSearch}
      className="flex flex-1 gap-2"
    >
      <input
        type="text"
        value={taskSearch}
        onChange={(e) => setTaskSearch(e.target.value)}
        placeholder="Search tasks by title..."
        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
      />

      <button
        type="submit"
        className="rounded-lg bg-gray-800 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-900"
      >
        Search
      </button>
    </form>

    {/* Status */}
    <select
      value={taskStatus}
      onChange={(e) => {
        setTaskStatus(
          e.target.value as TaskStatus | ""
        );
        setTaskPage(1);
      }}
      className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
    >
      <option value="">All statuses</option>
      <option value="todo">Todo</option>
      <option value="in-progress">
        In Progress
      </option>
      <option value="done">Done</option>
    </select>

    {/* Sort */}
    <select
      value={taskSort}
      onChange={(e) => {
        setTaskSort(e.target.value as TaskSort);
        setTaskPage(1);
      }}
      className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
    >
      <option value="createdAt">
        Newest
      </option>
      <option value="dueDate">
        Due Date
      </option>
      <option value="title">
        Title
      </option>
    </select>
  </div>

  {/* Task error */}
  {tasksError && (
    <div className="mt-5 rounded-lg bg-red-100 p-4 text-sm text-red-700">
      {tasksError}
    </div>
  )}

  {/* Loading */}
  {tasksLoading ? (
    <div className="mt-6 py-10 text-center">
      <p className="text-sm text-gray-500">
        Loading tasks...
      </p>
    </div>
  ) : tasks.length === 0 ? (
    /* Empty */
    <div className="mt-6 rounded-lg border border-dashed border-gray-300 p-8 text-center">
      <p className="text-sm text-gray-500">
        No tasks found.
      </p>

      <Link
        to={`/projects/${project._id}/tasks/new`}
        className="mt-4 inline-block text-sm font-medium text-blue-600 hover:text-blue-700"
      >
        Create your first task
      </Link>
    </div>
  ) : (
    <>
      {/* Tasks */}
        <div className="mt-6 space-y-4">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="rounded-lg border border-gray-200 p-4 transition hover:border-gray-300 hover:shadow-sm"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                {/* Task info */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {task.title}
                    </h3>

                    {/* Status */}
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        task.status === "done"
                          ? "bg-green-100 text-green-700"
                          : task.status === "in-progress"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {task.status === "in-progress"
                        ? "In Progress"
                        : task.status}
                    </span>

                    {/* Priority */}
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        task.priority === "high"
                          ? "bg-red-100 text-red-700"
                          : task.priority === "medium"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>

                  <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                    {task.description}
                  </p>

                  <p className="mt-3 text-xs text-gray-400">
                    Due{" "}
                    {new Date(
                      task.dueDate
                    ).toLocaleDateString()}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex shrink-0 gap-2">
                  <Link
                    to={`/tasks/${task._id}`}
                    className="rounded-lg bg-blue-100 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-200"
                  >
                    View
                  </Link>

                  <Link
                    to={`/tasks/${task._id}/edit`}
                    className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() =>
                      handleDeleteTask(task._id)
                    }
                    className="rounded-lg bg-red-100 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {taskTotalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              onClick={() =>
                setTaskPage((page) => page - 1)
              }
              disabled={taskPage === 1}
              className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>

            <span className="text-sm text-gray-600">
              Page {taskPage} of {taskTotalPages}
            </span>

            <button
              onClick={() =>
                setTaskPage((page) => page + 1)
              }
              disabled={taskPage === taskTotalPages}
              className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </>
    )}
  </div>

      </div>
    </div>
  );
}

export default ProjectDetails;