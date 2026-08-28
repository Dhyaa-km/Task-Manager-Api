import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getUserById } from "../services/adminUserService";
import type { AdminUserDetails } from "../types/adminUser";

function UserDetails() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState<AdminUserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Loading user...</p>
      </div>
    );
  }

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

          <h1 className="mb-8 text-3xl font-bold text-gray-900">
            User Details
          </h1>

          <div className="space-y-6">

            <div>
              <p className="text-sm font-medium text-gray-500">
                Username
              </p>

              <p className="mt-1 text-lg text-gray-900">
                {user.username}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">
                Email
              </p>

              <p className="mt-1 text-lg text-gray-900">
                {user.email}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">
                Role
              </p>

              <p className="mt-1 text-lg text-gray-900">
                {user.role}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">
                Status
              </p>

              <p className="mt-1 text-lg text-gray-900">
                {user.status}
              </p>
            </div>

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
        </div>
      </div>
    </div>
  );
}

export default UserDetails;