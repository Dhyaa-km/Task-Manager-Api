import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  ListTodo,
  Loader2,
  Save,
} from "lucide-react";

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
          err.response?.data?.message || "Failed to load task."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [taskId]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
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
      setError("Description must be at least 10 characters.");
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
        err.response?.data?.message || "Failed to update task."
      );
    } finally {
      setSaving(false);
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

  if (error && !task) {
    return (
      <div className="mx-auto max-w-3xl">
        <div className="ui-card p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>

          <h2 className="mt-4 text-lg font-semibold text-gray-900">
            Unable to load task
          </h2>

          <p className="mt-2 text-sm text-red-600">
            {error}
          </p>

          <Link
            to="/projects"
            className="ui-button-secondary mt-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
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
    <div className="mx-auto max-w-3xl">
      {/* Back */}
      <Link
        to={`/tasks/${task._id}`}
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-indigo-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Task
      </Link>

      {/* Page Header */}
      <div className="mt-5 flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-100">
          <ListTodo className="h-6 w-6 text-indigo-600" />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Edit Task
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Update the task information.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="ui-card mt-6 p-5 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error */}
          {error && (
            <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="title" className="ui-label">
                Title
              </label>

              <span className="text-xs text-gray-400">
                {title.length}/100
              </span>
            </div>

            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              maxLength={100}
              disabled={saving}
              className="ui-input disabled:cursor-not-allowed disabled:bg-gray-100"
            />
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="description" className="ui-label">
                Description
              </label>

              <span className="text-xs text-gray-400">
                {description.length}/1000
              </span>
            </div>

            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the task..."
              rows={6}
              maxLength={1000}
              disabled={saving}
              className="ui-input resize-none disabled:cursor-not-allowed disabled:bg-gray-100"
            />
          </div>

          {/* Priority + Status */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="priority" className="ui-label">
                Priority
              </label>

              <select
                id="priority"
                value={priority}
                onChange={(e) =>
                  setPriority(e.target.value as TaskPriority)
                }
                disabled={saving}
                className="ui-input disabled:cursor-not-allowed disabled:bg-gray-100"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label htmlFor="status" className="ui-label">
                Status
              </label>

              <select
                id="status"
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as TaskStatus)
                }
                disabled={saving}
                className="ui-input disabled:cursor-not-allowed disabled:bg-gray-100"
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label htmlFor="dueDate" className="ui-label">
              Due Date
            </label>

            <input
              id="dueDate"
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              disabled={saving}
              className="ui-input disabled:cursor-not-allowed disabled:bg-gray-100"
            />

            <p className="mt-1.5 text-xs text-gray-400">
              Choose a future date and time for this task.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">
            <Link
              to={`/tasks/${task._id}`}
              className="ui-button-secondary w-full sm:w-auto"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="ui-button-primary w-full disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditTask;