import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  Mail,
  Save,
  ShieldCheck,
  Trash2,
  UserRound,
  UserCog,
} from "lucide-react";

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

  const [role, setRole] = useState<"user" | "admin">("user");
  const [status, setStatus] = useState<"active" | "inactive">("active");

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [updateError, setUpdateError] = useState("");

  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      if (!userId) {
        setError("User ID is missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const data = await getUserById(userId);

        setUser(data);
        setRole(data.role);
        setStatus(data.status);
      } catch (error: any) {
        setError(
          error.response?.data?.message || "Failed to load user."
        );
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [userId]);

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
        error.response?.data?.message || "Failed to update user."
      );
    } finally {
      setSaving(false);
    }
  };

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
        error.response?.data?.message || "Failed to delete user."
      );
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-2rem)] items-center justify-center p-6">
        <div className="ui-card w-full max-w-md p-8 text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600" />
          <p className="mt-4 text-sm text-gray-500">Loading user...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <div className="ui-card flex items-start gap-3 border-red-200 bg-red-50 p-5 text-red-700">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="font-medium">Unable to load user</p>
            <p className="mt-1 text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="mx-auto max-w-5xl p-2">
      {/* Back */}
      <button
        type="button"
        onClick={() => navigate("/admin/users")}
        className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-indigo-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Users
      </button>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
            <UserCog className="h-6 w-6" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              User Details
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              View and manage this user's account.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* User information */}
        <section className="ui-card overflow-hidden">
          <div className="border-b border-gray-200 px-5 py-5 sm:px-6">
            <div className="flex items-center gap-3">
              <UserRound className="h-5 w-5 text-indigo-600" />
              <div>
                <h2 className="font-semibold text-gray-900">
                  Account Information
                </h2>
                <p className="mt-0.5 text-sm text-gray-500">
                  Basic information about this user.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
            {/* Username */}
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <UserRound className="h-4 w-4" />
                Username
              </div>
              <p className="mt-2 font-semibold text-gray-900">
                {user.username}
              </p>
            </div>

            {/* Email */}
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Mail className="h-4 w-4" />
                Email
              </div>
              <p className="mt-2 break-all font-semibold text-gray-900">
                {user.email}
              </p>
            </div>

            {/* Role */}
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <ShieldCheck className="h-4 w-4" />
                Current Role
              </div>

              <span
                className={`ui-badge mt-2 ${
                  user.role === "admin"
                    ? "bg-purple-100 text-purple-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {user.role}
              </span>
            </div>

            {/* Status */}
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    user.status === "active"
                      ? "bg-green-500"
                      : "bg-gray-400"
                  }`}
                />
                Current Status
              </div>

              <span
                className={`ui-badge mt-2 ${
                  user.status === "active"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {user.status}
              </span>
            </div>

            {/* Created */}
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 sm:col-span-2">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <CalendarDays className="h-4 w-4" />
                Account Created
              </div>

              <p className="mt-2 font-semibold text-gray-900">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </section>

        {/* Edit user */}
        <section className="ui-card overflow-hidden">
          <div className="border-b border-gray-200 px-5 py-5 sm:px-6">
            <div className="flex items-center gap-3">
              <UserCog className="h-5 w-5 text-indigo-600" />
              <div>
                <h2 className="font-semibold text-gray-900">
                  Edit User
                </h2>
                <p className="mt-0.5 text-sm text-gray-500">
                  Change the user's role or account status.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-5 p-5 sm:p-6">
            <div className="grid gap-5 sm:grid-cols-2">
              {/* Role */}
              <div>
                <label htmlFor="role" className="ui-label">
                  Role
                </label>

                <select
                  id="role"
                  value={role}
                  onChange={(e) =>
                    setRole(e.target.value as "user" | "admin")
                  }
                  className="ui-input"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label htmlFor="status" className="ui-label">
                  Status
                </label>

                <select
                  id="status"
                  value={status}
                  onChange={(e) =>
                    setStatus(
                      e.target.value as "active" | "inactive"
                    )
                  }
                  className="ui-input"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            {updateError && (
              <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                <p className="text-sm">{updateError}</p>
              </div>
            )}

            {success && (
              <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                <ShieldCheck className="h-5 w-5 shrink-0" />
                {success}
              </div>
            )}

            <button
              type="button"
              onClick={handleUpdate}
              disabled={saving}
              className="ui-button-primary gap-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
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
        </section>

        {/* Danger zone */}
        <section className="rounded-xl border border-red-200 bg-white shadow-sm">
          <div className="border-b border-red-100 px-5 py-5 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-100 text-red-600">
                <Trash2 className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-semibold text-red-700">
                  Danger Zone
                </h2>
                <p className="mt-0.5 text-sm text-gray-500">
                  Permanently remove this user account.
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            <p className="text-sm leading-6 text-gray-600">
              Deleting this user will permanently remove their account
              and associated data. This action cannot be undone.
            </p>

            {deleteError && (
              <div className="mt-4 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                <p className="text-sm">{deleteError}</p>
              </div>
            )}

            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="ui-button-danger mt-5 gap-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {deleting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  Delete User
                </>
              )}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default UserDetails;