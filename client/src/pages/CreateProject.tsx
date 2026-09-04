import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createProject } from "../services/projectService";

function CreateProject() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    // Client-side validation
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
      setLoading(true);

      await createProject({
        title: trimmedTitle,
        description: trimmedDescription,
      });

      // Project created successfully
      navigate("/projects");
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to create project."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-6">
          <Link
            to="/projects"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            ← Back to Projects
          </Link>

          <h1 className="mt-4 text-3xl font-bold text-gray-900">
            Create Project
          </h1>

          <p className="mt-1 text-gray-500">
            Create a new project to start managing your tasks.
          </p>
        </div>

        {/* Form */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          {/* Error */}
          {error && (
            <div className="mb-5 rounded-lg bg-red-100 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Project Title
              </label>

              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter project title"
                disabled={loading}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100"
              />

              <p className="mt-1 text-xs text-gray-400">
                Minimum 3 characters
              </p>
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Description
              </label>

              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your project..."
                rows={6}
                disabled={loading}
                className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100"
              />

              <p className="mt-1 text-xs text-gray-400">
                Minimum 10 characters
              </p>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-2">
              <Link
                to="/projects"
                className="rounded-lg bg-gray-200 px-5 py-2.5 font-medium text-gray-700 transition hover:bg-gray-300"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create Project"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateProject;