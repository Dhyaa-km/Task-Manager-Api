
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getUserById,
  updateUserById,
  deleteUser,
} from "../services/adminUserService";

import type { AdminUserDetails } from "../types/adminUser";

function UserDetails() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState<AdminUserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Edit states
  const [role, setRole] = useState<"user" | "admin">("user");
  const [status, setStatus] = useState<"active" | "inactive">("active");

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [updateError, setUpdateError] = useState("");

  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(""); 

  // Load user
  useEffect(() => {
    const loadUser = async () => {
      if (!userId) {
        setError("User ID is missing.");
        setLoading(false);
        return;
      }

      try {
        const data = await getUserById(userId);

        setUser(data);
        setRole(data.role);
        setStatus(data.status);
      } catch (error: any) {
        setError(
          error.response?.data?.message ||
            "Failed to load user."
        );
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [userId]);

  // Update user
  const handleUpdate = async () => {
    if (!userId) return;

    try {
      setSaving(true);
      setSuccess("");
      setUpdateError("");

      const updatedUser = await updateUserById(userId, {
        role,
        status,
      });

      setUser(updatedUser);
      setRole(updatedUser.role);
      setStatus(updatedUser.status);

      setSuccess("User updated successfully.");
    } catch (error: any) {
      setUpdateError(
        error.response?.data?.message ||
          "Failed to update user."
      );
    } finally {
      setSaving(false);
    }
  };

  // Delete user 
  const handleDelete = async () => {
  if (!userId) return;

  const confirmed = window.confirm(
    `Are you sure you want to delete "${user?.username}"? This action cannot be undone.`
  );

  if (!confirmed) return;

  try {
    setDeleting(true);
    setDeleteError("");

    await deleteUser(userId);

    navigate("/admin/users");
  } catch (error: any) {
    setDeleteError(
      error.response?.data?.message ||
        "Failed to delete user."
    );
  } finally {
    setDeleting(false);
  }
  };

  // Loading
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">
          Loading user...
        </p>
      </div>
    );
  }

  // Loading error
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="rounded-lg bg-red-100 px-6 py-4 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }


  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-3xl">

        {/* Back button */}
        <button
          onClick={() => navigate("/admin/users")}
          className="mb-6 font-medium text-blue-600 hover:text-blue-800"
        >
          ← Back to Users
        </button>

        {/* User card */}
        <div className="rounded-xl bg-white p-8 shadow-sm">

          {/* Title */}
          <h1 className="mb-8 text-3xl font-bold text-gray-900">
            User Details
          </h1>

          {/* User information */}
          <div className="space-y-6">

            {/* Username */}
            <div>
              <p className="text-sm font-medium text-gray-500">
                Username
              </p>

              <p className="mt-1 text-lg text-gray-900">
                {user.username}
              </p>
            </div>

            {/* Email */}
            <div>
              <p className="text-sm font-medium text-gray-500">
                Email
              </p>

              <p className="mt-1 text-lg text-gray-900">
                {user.email}
              </p>
            </div>

            {/* Role */}
            <div>
              <p className="text-sm font-medium text-gray-500">
                Role
              </p>

              <p className="mt-1 text-lg text-gray-900">
                {user.role}
              </p>
            </div>

            {/* Status */}
            <div>
              <p className="text-sm font-medium text-gray-500">
                Status
              </p>

              <p className="mt-1 text-lg text-gray-900">
                {user.status}
              </p>
            </div>

            {/* Created */}
            <div>
              <p className="text-sm font-medium text-gray-500">
                Created
              </p>

              <p className="mt-1 text-lg text-gray-900">
                {new Date(
                  user.createdAt
                ).toLocaleDateString()}
              </p>
            </div>

          </div>

          {/* Edit User */}
          <div className="mt-8 border-t pt-8">

            <h2 className="text-xl font-bold text-gray-900">
              Edit User
            </h2>

            {/* Role */}
            <div className="mt-6">
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700"
              >
                Role
              </label>

              <select
                id="role"
                value={role}
                onChange={(e) =>
                  setRole(
                    e.target.value as "user" | "admin"
                  )
                }
                className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2"
              >
                <option value="user">
                  User
                </option>

                <option value="admin">
                  Admin
                </option>
              </select>
            </div>

            {/* Status */}
            <div className="mt-6">
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700"
              >
                Status
              </label>

              <select
                id="status"
                value={status}
                onChange={(e) =>
                  setStatus(
                    e.target.value as
                      | "active"
                      | "inactive"
                  )
                }
                className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2"
              >
                <option value="active">
                  Active
                </option>

                <option value="inactive">
                  Inactive
                </option>
              </select>
            </div>

            {/* Update error */}
            {updateError && (
              <div className="mt-4 rounded-lg bg-red-100 px-4 py-3 text-red-700">
                {updateError}
              </div>
            )}

            {/* Update success */}
            {success && (
              <div className="mt-4 rounded-lg bg-green-100 px-4 py-3 text-green-700">
                {success}
              </div>
            )}

            {/* Save button */}
            <button
              onClick={handleUpdate}
              disabled={saving}
              className="mt-6 rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>

          </div>

          <div className="mt-8 border-t pt-8">
            <h2 className="text-xl font-bold text-gray-900">
              Danger Zone
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Deleting this user will permanently remove their account
              and associated data.
            </p>

            {deleteError && (
              <div className="mt-4 rounded-lg bg-red-100 px-4 py-3 text-red-700">
                {deleteError}
              </div>
            )}

            <button
              onClick={handleDelete}
              disabled={deleting}
              className="mt-5 rounded-lg bg-red-600 px-5 py-2.5 font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {deleting ? "Deleting..." : "Delete User"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default UserDetails;
