import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Edit3,
  FolderKanban,
  Plus,
  Trash2,
  AlertCircle,
} from "lucide-react";

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
      fetchProjects(currentPage);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to delete project."
      );
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600" />

          <p className="text-sm text-gray-500">
            Loading projects...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <FolderKanban className="h-5 w-5" />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                Projects
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Organize and manage your projects.
              </p>
            </div>
          </div>
        </div>

        <Link
          to="/projects/new"
          className="ui-button-primary w-full gap-2 sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          New Project
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {projects.length === 0 ? (
        <div className="ui-card px-6 py-16 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <FolderKanban className="h-8 w-8" />
          </div>

          <h2 className="mt-5 text-xl font-semibold text-gray-900">
            No projects yet
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
            Create your first project and start organizing your
            tasks in one place.
          </p>

          <Link
            to="/projects/new"
            className="ui-button-primary mt-6 gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Project
          </Link>
        </div>
      ) : (
        <>
          {/* Projects Grid */}
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <div
                key={project._id}
                className="group flex flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                {/* Card Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                      <FolderKanban className="h-5 w-5" />
                    </div>

                    <h2
                      className="truncate text-lg font-semibold text-gray-900"
                      title={project.title}
                    >
                      {project.title}
                    </h2>
                  </div>

                  <span
                    className={`ui-badge shrink-0 ${
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

                {/* Description */}
                <p className="mt-5 min-h-[60px] line-clamp-3 text-sm leading-6 text-gray-600">
                  {project.description || "No description provided."}
                </p>

                {/* Created Date */}
                <div className="mt-5 flex items-center gap-2 border-t border-gray-100 pt-4 text-xs text-gray-500">
                  <CalendarDays className="h-4 w-4" />

                  <span>
                    Created{" "}
                    {new Date(project.createdAt).toLocaleDateString(
                      undefined,
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </span>
                </div>

                {/* Actions */}
                <div className="mt-4 flex gap-2">
                  <Link
                    to={`/projects/${project._id}`}
                    className="ui-button-primary flex-1"
                  >
                    View Project
                  </Link>

                  <Link
                    to={`/projects/${project._id}/edit`}
                    className="ui-button-secondary px-3"
                    title="Edit project"
                    aria-label={`Edit ${project.title}`}
                  >
                    <Edit3 className="h-4 w-4" />
                  </Link>

                  <button
                    onClick={() => handleDelete(project._id)}
                    className="inline-flex items-center justify-center rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-100"
                    title="Delete project"
                    aria-label={`Delete ${project.title}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm sm:px-5">
              <button
                onClick={() =>
                  setCurrentPage((page) => page - 1)
                }
                disabled={currentPage === 1}
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
                  {currentPage}
                </span>{" "}
                of {totalPages}
              </span>

              <button
                onClick={() =>
                  setCurrentPage((page) => page + 1)
                }
                disabled={currentPage === totalPages}
                className="ui-button-secondary gap-2 px-3 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Projects;