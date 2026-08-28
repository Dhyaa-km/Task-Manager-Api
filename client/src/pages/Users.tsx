import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getAllUsers,
} from "../services/adminUserService";

import type {
  AdminUser,
} from "../types/adminUser";

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
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Users
          </h1>

          <p className="mt-2 text-gray-500">
            Manage users in your Task Manager.
          </p>
        </div>

        {/* Filter */}
        <div className="mb-6 flex items-center gap-3">
          <label
            htmlFor="status"
            className="font-medium text-gray-700"
          >
            Status:
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
            className="rounded-lg border border-gray-300 bg-white px-4 py-2"
          >
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-lg bg-red-100 px-6 py-4 text-red-700">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <p className="text-gray-500">
              Loading users...
            </p>
          </div>
        ) : (
          <>
            {/* Users table */}
            <div className="overflow-hidden rounded-xl bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="border-b bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                        Username
                      </th>

                      <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                        Email
                      </th>

                      <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                        Status
                      </th>

                      <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                        Created
                      </th>

                      <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y">
                    {users.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-6 py-8 text-center text-gray-500"
                        >
                          No users found.
                        </td>
                      </tr>
                    ) : (
                      users.map((user) => (
                        <tr
                          key={user._id}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-6 py-4 font-medium text-gray-900">
                            {user.username}
                          </td>

                          <td className="px-6 py-4 text-gray-600">
                            {user.email}
                          </td>

                          <td className="px-6 py-4">
                            <span
                              className={
                                user.status === "active"
                                  ? "rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700"
                                  : "rounded-full bg-gray-200 px-3 py-1 text-sm font-medium text-gray-700"
                              }
                            >
                              {user.status}
                            </span>
                          </td>

                          <td className="px-6 py-4 text-gray-600">
                            {new Date(
                              user.createdAt
                            ).toLocaleDateString()}
                          </td>

                          <td className="px-6 py-4">
                            <button className="font-medium text-blue-600 hover:text-blue-800"
                                onClick={() =>
                                    navigate(`/admin/users/${user._id}`)
                                }
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

            {/* Pagination */}
            <div className="mt-6 flex items-center justify-center gap-4">
              <button
                disabled={page === 1}
                onClick={() =>
                  setPage((current) => current - 1)
                }
                className="rounded-lg border bg-white px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>

              <span className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </span>

              <button
                disabled={page === totalPages}
                onClick={() =>
                  setPage((current) => current + 1)
                }
                className="rounded-lg border bg-white px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Users;