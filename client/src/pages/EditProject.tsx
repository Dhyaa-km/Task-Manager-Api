import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  FolderKanban,
  Loader2,
  Save,
} from "lucide-react";

import {
  getProjectById,
  updateProject,
} from "../services/projectService";
import type { ProjectStatus } from "../types/project";

function EditProject() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<ProjectStatus>("active");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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

        const project = await getProjectById(id);

        setTitle(project.title);
        setDescription(project.description);
        setStatus(project.status);
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!id) {
      setError("Project ID is missing.");
      return;
    }

    setError("");

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (!trimmedTitle || !trimmedDescription) {
      setError("Title and description are required.");
      return;
    }

    if (trimmedTitle.length < 3) {
      setError("Title must be at least 3 characters long.");
      return;
    }

    if (trimmedDescription.length < 10) {
      setError("Description must be at least 10 characters long.");
      return;
    }

    try {
      setSaving(true);

      await updateProject(id, {
        title: trimmedTitle,
        description: trimmedDescription,
        status,
      });

      navigate(`/projects/${id}`);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to update project."
      );
    } finally {
      setSaving(false);
    }
  };

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

  return (
    <div className="mx-auto max-w-3xl">
      {/* Header */}
      <div className="mb-8">
        <Link
          to={`/projects/${id}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-indigo-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Project
        </Link>

        <div className="mt-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <FolderKanban className="h-5 w-5" />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Edit Project
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Update your project information.
            </p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="ui-card">
        <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
          <h2 className="text-base font-semibold text-gray-900">
            Project Information
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Modify the details and status of your project.
          </p>
        </div>

        <div className="p-5 sm:p-6">
          {/* Error */}
          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

              <p className="text-sm font-medium">
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="ui-label">
                Project Title
              </label>

              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={saving}
                maxLength={100}
                className="ui-input disabled:cursor-not-allowed disabled:bg-gray-50"
              />

              <div className="mt-1.5 flex items-center justify-between">
                <p className="text-xs text-gray-400">
                  Minimum 3 characters
                </p>

                <span className="text-xs text-gray-400">
                  {title.length}/100
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="ui-label">
                Description
              </label>

              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={7}
                disabled={saving}
                maxLength={1000}
                className="ui-input resize-none disabled:cursor-not-allowed disabled:bg-gray-50"
              />

              <div className="mt-1.5 flex items-center justify-between">
                <p className="text-xs text-gray-400">
                  Minimum 10 characters
                </p>

                <span className="text-xs text-gray-400">
                  {description.length}/1000
                </span>
              </div>
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className="ui-label">
                Project Status
              </label>

              <select
                id="status"
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as ProjectStatus)
                }
                disabled={saving}
                className="ui-input disabled:cursor-not-allowed disabled:bg-gray-50"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              <p className="mt-1.5 text-xs text-gray-400">
                Inactive projects can remain stored without being
                considered active.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
              <Link
                to={`/projects/${id}`}
                className="ui-button-secondary w-full sm:w-auto"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={saving}
                className="ui-button-primary w-full gap-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditProject;