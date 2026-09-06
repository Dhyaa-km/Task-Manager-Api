import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  UserRound,
  Users as UsersIcon,
} from "lucide-react";

import { getAllUsers } from "../services/adminUserService";
import type { AdminUser } from "../types/adminUser";

function Users() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [status, setStatus] = useState<
    "" | "active" | "inactive"
  >("");

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getAllUsers({
          page,
          limit: 10,
          ...(status && { status }),
        });

        setUsers(data.users);
        setTotalPages(data.totalPages);
      } catch (error: any) {
        setError(
          error.response?.data?.message ||
            "Failed to load users."
        );
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [page, status]);

  const handleStatusChange = (
    value: "" | "active" | "inactive"
  ) => {
    setStatus(value);
    setPage(1);
  };

  return (
    <div className="mx-auto max-w-7xl p-2">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-100">
            <UsersIcon className="h-6 w-6 text-indigo-600" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Users
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage users in your Task Manager.
            </p>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="ui-card mt-6 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label
            htmlFor="status"
            className="text-sm font-medium text-gray-700"
          >
            Filter by status
          </label>

          <select
            id="status"
            value={status}
            onChange={(e) =>
              handleStatusChange(
                e.target.value as
                  | ""
                  | "active"
                  | "inactive"
              )
            }
            className="ui-input sm:w-48"
          >
            <option value="">All Users</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="ui-card mt-6 flex min-h-75 items-center justify-center">
          <div className="flex items-center gap-3 text-gray-500">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-indigo-600" />
            <span>Loading users...</span>
          </div>
        </div>
      ) : (
        <>
          {/* Desktop / Tablet Table */}
          <div className="ui-card mt-6 hidden overflow-hidden md:block">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      User
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Email
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Role
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Created
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {users.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-12 text-center"
                      >
                        <UserRound className="mx-auto h-8 w-8 text-gray-300" />

                        <p className="mt-3 text-sm font-medium text-gray-700">
                          No users found
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          Try changing the status filter.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr
                        key={user._id}
                        className="transition hover:bg-gray-50"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100">
                              <UserRound className="h-4 w-4 text-indigo-600" />
                            </div>

                            <span className="font-medium text-gray-900">
                              {user.username}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-600">
                          {user.email}
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`ui-badge ${
                              user.role === "admin"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {user.role === "admin" && (
                              <ShieldCheck className="mr-1 h-3.5 w-3.5" />
                            )}
                            {user.role}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`ui-badge capitalize ${
                              user.status === "active"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {user.status}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(
                            user.createdAt
                          ).toLocaleDateString()}
                        </td>

                        <td className="px-6 py-4 text-right">
                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/admin/users/${user._id}`
                              )
                            }
                            className="text-sm font-medium text-indigo-600 transition hover:text-indigo-800"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="mt-6 space-y-3 md:hidden">
            {users.length === 0 ? (
              <div className="ui-card px-6 py-12 text-center">
                <UserRound className="mx-auto h-8 w-8 text-gray-300" />

                <p className="mt-3 text-sm font-medium text-gray-700">
                  No users found
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  Try changing the status filter.
                </p>
              </div>
            ) : (
              users.map((user) => (
                <div
                  key={user._id}
                  className="ui-card p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100">
                        <UserRound className="h-5 w-5 text-indigo-600" />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-semibold text-gray-900">
                          {user.username}
                        </p>

                        <p className="truncate text-sm text-gray-500">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/admin/users/${user._id}`
                        )
                      }
                      className="shrink-0 text-sm font-medium text-indigo-600"
                    >
                      View
                    </button>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span
                      className={`ui-badge ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {user.role === "admin" && (
                        <ShieldCheck className="mr-1 h-3.5 w-3.5" />
                      )}
                      {user.role}
                    </span>

                    <span
                      className={`ui-badge capitalize ${
                        user.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {user.status}
                    </span>

                    <span className="ml-auto text-xs text-gray-400">
                      {new Date(
                        user.createdAt
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {users.length > 0 && (
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                disabled={page === 1}
                onClick={() =>
                  setPage((current) => current - 1)
                }
                className="ui-button-secondary px-3 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline">
                  Previous
                </span>
              </button>

              <span className="min-w-24 text-center text-sm text-gray-600">
                Page {page} of {totalPages}
              </span>

              <button
                type="button"
                disabled={page === totalPages}
                onClick={() =>
                  setPage((current) => current + 1)
                }
                className="ui-button-secondary px-3 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Next page"
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
  );
}

export default Users;