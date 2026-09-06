import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { getTaskById, updateTask } from "../services/taskService";
import type {
  Task,
  TaskPriority,
  TaskStatus,
} from "../types/task";

function EditTask() {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();

  const [task, setTask] = useState<Task | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [status, setStatus] = useState<TaskStatus>("todo");
  const [dueDate, setDueDate] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Convert API date into datetime-local format
  const formatDateTimeLocal = (dateString: string) => {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // Get task
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
        setTitle(data.title);
        setDescription(data.description);
        setPriority(data.priority);
        setStatus(data.status);
        setDueDate(formatDateTimeLocal(data.dueDate));
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
            "Failed to load task."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [taskId]);

  // Submit
  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!taskId || !task) {
      setError("Task ID is missing.");
      return;
    }

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (trimmedTitle.length < 3) {
      setError("Title must be at least 3 characters.");
      return;
    }

    if (trimmedDescription.length < 10) {
      setError(
        "Description must be at least 10 characters."
      );
      return;
    }

    if (!dueDate) {
      setError("Due date is required.");
      return;
    }

    const selectedDate = new Date(dueDate);

    if (selectedDate <= new Date()) {
      setError("Due date must be in the future.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await updateTask(taskId, {
        title: trimmedTitle,
        description: trimmedDescription,
        priority,
        status,
        dueDate,
      });

      navigate(`/tasks/${taskId}`);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to update task."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500">
          Loading task...
        </p>
      </div>
    );
  }

  if (error && !task) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <p className="text-red-500">{error}</p>

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

  if (!task) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-2xl">
        {/* Back */}
        <Link
          to={`/tasks/${task._id}`}
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          ← Back to Task
        </Link>

        {/* Header */}
        <div className="mb-6 mt-4">
          <h1 className="text-3xl font-bold text-gray-900">
            Edit Task
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Update the task information.
          </p>
        </div>

        {/* Form */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Title
              </label>

              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                disabled={saving}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Description
              </label>

              <textarea
                id="description"
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                rows={5}
                disabled={saving}
                className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
              />
            </div>

            {/* Priority + Status */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="priority"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Priority
                </label>

                <select
                  id="priority"
                  value={priority}
                  onChange={(e) =>
                    setPriority(
                      e.target.value as TaskPriority
                    )
                  }
                  disabled={saving}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="status"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Status
                </label>

                <select
                  id="status"
                  value={status}
                  onChange={(e) =>
                    setStatus(
                      e.target.value as TaskStatus
                    )
                  }
                  disabled={saving}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">
                    In Progress
                  </option>
                  <option value="done">Done</option>
                </select>
              </div>
            </div>

            {/* Due Date */}
            <div>
              <label
                htmlFor="dueDate"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Due Date
              </label>

              <input
                id="dueDate"
                type="datetime-local"
                value={dueDate}
                onChange={(e) =>
                  setDueDate(e.target.value)
                }
                disabled={saving}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
              />
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-5">
              <Link
                to={`/tasks/${task._id}`}
                className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditTask;