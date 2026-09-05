import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

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
        setError(
          err.response?.data?.message || "Failed to load task."
        );
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
      setError(
        err.response?.data?.message || "Failed to delete task."
      );
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading task...</p>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <p className="text-red-500">
            {error || "Task not found."}
          </p>

          <Link
            to="/projects"
            className="mt-4 inline-block text-blue-600 hover:underline"
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

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-3xl">
        {/* Back */}
        <Link
          to={`/projects/${task.project}`}
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          ← Back to Project
        </Link>

        {/* Header */}
        <div className="mt-5 rounded-xl bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {task.title}
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Task ID: {task._id}
              </p>
            </div>

            <div className="flex gap-2">
              <Link
                to={`/tasks/${task._id}/edit`}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Edit
              </Link>

              <button
                type="button"
                onClick={handleDelete}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>

          {/* Status + Priority */}
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
              Status: {task.status}
            </span>

            <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700">
              Priority: {task.priority}
            </span>
          </div>

          {/* Description */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900">
              Description
            </h2>

            <p className="mt-2 whitespace-pre-wrap text-gray-600">
              {task.description}
            </p>
          </div>

          {/* Task information */}
          <div className="mt-8 grid grid-cols-1 gap-5 border-t border-gray-100 pt-6 sm:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Due Date
              </p>

              <p className="mt-1 text-gray-900">
                {formattedDueDate}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">
                Project ID
              </p>

              <p className="mt-1 break-all text-sm text-gray-900">
                {task.project}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">
                Created At
              </p>

              <p className="mt-1 text-gray-900">
                {formattedCreatedAt}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">
                Last Updated
              </p>

              <p className="mt-1 text-gray-900">
                {formattedUpdatedAt}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskDetails;