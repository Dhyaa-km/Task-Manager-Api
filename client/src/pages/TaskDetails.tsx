import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  Clock3,
  Edit3,
  FolderKanban,
  ListTodo,
  Loader2,
  Trash2,
} from "lucide-react";

import { deleteTask, getTaskById } from "../services/taskService";
import type { Task } from "../types/task";

function TaskDetails() {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTask = async () => {
      if (!taskId) {
        setError("Task ID is missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const data = await getTaskById(taskId);
        setTask(data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load task.");
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [taskId]);

  const handleDelete = async () => {
    if (!taskId || !task) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${task.title}"?`
    );

    if (!confirmed) return;

    try {
      setError("");

      await deleteTask(taskId);

      navigate(`/projects/${task.project}`);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete task.");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="flex items-center gap-3 text-gray-500">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading task...</span>
        </div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="mx-auto max-w-3xl">
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-indigo-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </Link>

        <div className="ui-card mt-6 p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>

          <h2 className="mt-4 text-lg font-semibold text-gray-900">
            Unable to load task
          </h2>

          <p className="mt-2 text-sm text-red-600">
            {error || "Task not found."}
          </p>

          <Link
            to="/projects"
            className="ui-button-secondary mt-6"
          >
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  const formattedDueDate = new Date(task.dueDate).toLocaleString();
  const formattedCreatedAt = new Date(task.createdAt).toLocaleString();
  const formattedUpdatedAt = new Date(task.updatedAt).toLocaleString();

  const statusStyles: Record<string, string> = {
    todo: "bg-gray-100 text-gray-700",
    "in-progress": "bg-blue-100 text-blue-700",
    done: "bg-green-100 text-green-700",
  };

  const priorityStyles: Record<string, string> = {
    low: "bg-gray-100 text-gray-700",
    medium: "bg-yellow-100 text-yellow-700",
    high: "bg-red-100 text-red-700",
  };

  return (
    <div className="mx-auto max-w-4xl">
      {/* Back */}
      <Link
        to={`/projects/${task.project}`}
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-indigo-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Project
      </Link>

      {/* Header */}
      <div className="ui-card mt-5 overflow-hidden">
        <div className="border-b border-gray-100 p-5 sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex min-w-0 items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-100">
                <ListTodo className="h-6 w-6 text-indigo-600" />
              </div>

              <div className="min-w-0">
                <h1 className="break-words text-2xl font-bold text-gray-900 sm:text-3xl">
                  {task.title}
                </h1>

                <p className="mt-1 break-all text-xs text-gray-400">
                  ID: {task._id}
                </p>
              </div>
            </div>

            <div className="flex shrink-0 gap-2">
              <Link
                to={`/tasks/${task._id}/edit`}
                className="ui-button-secondary"
              >
                <Edit3 className="mr-2 h-4 w-4" />
                Edit
              </Link>

              <button
                type="button"
                onClick={handleDelete}
                className="ui-button-danger"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </button>
            </div>
          </div>

          {/* Status + Priority */}
          <div className="mt-5 flex flex-wrap gap-2">
            <span
              className={`ui-badge capitalize ${
                statusStyles[task.status] || "bg-gray-100 text-gray-700"
              }`}
            >
              {task.status.replace("-", " ")}
            </span>

            <span
              className={`ui-badge capitalize ${
                priorityStyles[task.priority] ||
                "bg-gray-100 text-gray-700"
              }`}
            >
              {task.priority} priority
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="p-5 sm:p-6">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              Description
            </h2>

            <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-gray-600">
              {task.description || "No description provided."}
            </p>
          </div>

          {/* Task Information */}
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-indigo-600" />
                <p className="text-sm font-medium text-gray-500">
                  Due Date
                </p>
              </div>

              <p className="mt-2 text-sm font-medium text-gray-900">
                {formattedDueDate}
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-center gap-2">
                <FolderKanban className="h-4 w-4 text-indigo-600" />
                <p className="text-sm font-medium text-gray-500">
                  Project
                </p>
              </div>

              <p className="mt-2 break-all text-sm font-medium text-gray-900">
                {task.project}
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-indigo-600" />
                <p className="text-sm font-medium text-gray-500">
                  Created
                </p>
              </div>

              <p className="mt-2 text-sm font-medium text-gray-900">
                {formattedCreatedAt}
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-indigo-600" />
                <p className="text-sm font-medium text-gray-500">
                  Last Updated
                </p>
              </div>

              <p className="mt-2 text-sm font-medium text-gray-900">
                {formattedUpdatedAt}
              </p>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskDetails;