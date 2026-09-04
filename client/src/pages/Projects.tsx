import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllProjects, deleteProject } from "../services/projectService";
import type { Project } from "../types/project";

function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 10;

  const fetchProjects = async (page: number) => {
    try {
      setLoading(true);
      setError("");

      const data = await getAllProjects({
        page,
        limit,
      });

      setProjects(data.projects);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to load projects."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects(currentPage);
  }, [currentPage]);

  const handleDelete = async (projectId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteProject(projectId);

      // Refresh the current page after deletion
      fetchProjects(currentPage);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to delete project."
      );
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Loading projects...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Projects
            </h1>

            <p className="mt-1 text-gray-500">
              Manage your projects
            </p>
          </div>

          <Link
            to="/projects/new"
            className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
          >
            + Create Project
          </Link>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-lg bg-red-100 p-4 text-red-700">
            {error}
          </div>
        )}

        {/* Empty state */}
        {projects.length === 0 ? (
          <div className="rounded-lg bg-white p-10 text-center shadow">
            <h2 className="text-xl font-semibold text-gray-800">
              No projects yet
            </h2>

            <p className="mt-2 text-gray-500">
              Create your first project to get started.
            </p>

            <Link
              to="/projects/new"
              className="mt-5 inline-block rounded-lg bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700"
            >
              Create Project
            </Link>
          </div>
        ) : (
          <>
            {/* Projects */}
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <div
                  key={project._id}
                  className="rounded-xl bg-white p-5 shadow-sm transition hover:shadow-md"
                >
                  {/* Title + Status */}
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {project.title}
                    </h2>

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

                  {/* Description */}
                  <p className="mb-5 line-clamp-3 text-sm text-gray-600">
                    {project.description}
                  </p>

                  {/* Created */}
                  <p className="mb-5 text-xs text-gray-400">
                    Created{" "}
                    {new Date(project.createdAt).toLocaleDateString()}
                  </p>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    <Link
                      to={`/projects/${project._id}`}
                      className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                      View
                    </Link>

                    <Link
                      to={`/projects/${project._id}/edit`}
                      className="rounded-lg bg-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => handleDelete(project._id)}
                      className="rounded-lg bg-red-100 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-4">
                <button
                  onClick={() =>
                    setCurrentPage((page) => page - 1)
                  }
                  disabled={currentPage === 1}
                  className="rounded-lg bg-white px-4 py-2 font-medium text-gray-700 shadow disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>

                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() =>
                    setCurrentPage((page) => page + 1)
                  }
                  disabled={currentPage === totalPages}
                  className="rounded-lg bg-white px-4 py-2 font-medium text-gray-700 shadow disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Projects;