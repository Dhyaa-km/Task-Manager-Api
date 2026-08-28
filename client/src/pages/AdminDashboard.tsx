import { useEffect, useState } from "react";

import { getAdminDashboardStats } from "../services/adminDashboardService";
import type { AdminDashboardStats } from "../types/adminDashboard";
import { useAuth } from "../context/AuthContext";

function AdminDashboard() {
  const { user, logout } = useAuth();

  const [stats, setStats] =
    useState<AdminDashboardStats | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await getAdminDashboardStats();

        setStats(data);
      } catch (error: any) {
        setError(
          error.response?.data?.message ||
            "Failed to load admin dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">
          Loading admin dashboard...
        </p>
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

  if (!stats) {
    return null;
  }

  const cards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
    },
    {
      title: "Active Users",
      value: stats.activeUsers,
    },
    {
      title: "Inactive Users",
      value: stats.inactiveUsers,
    },
    {
      title: "Total Projects",
      value: stats.totalProjects,
    },
    {
      title: "Total Tasks",
      value: stats.totalTasks,
    },
    {
      title: "To Do",
      value: stats.todoTasks,
    },
    {
      title: "In Progress",
      value: stats.inProgressTasks,
    },
    {
      title: "Completed",
      value: stats.doneTasks,
    },
    {
      title: "Overdue",
      value: stats.overdueTasks,
    },
    {
      title: "High Priority",
      value: stats.highPriorityTasks,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h1>

            <p className="mt-2 text-gray-500">
              Welcome, {user?.username}. Here's an overview of the
              entire system.
            </p>
          </div>

          <button
            onClick={logout}
            className="rounded-lg bg-red-500 px-5 py-2.5 font-medium text-white transition hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        {/* Statistics */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <div
              key={card.title}
              className="rounded-xl bg-white p-6 shadow-sm"
            >
              <p className="text-sm font-medium text-gray-500">
                {card.title}
              </p>

              <p className="mt-3 text-3xl font-bold text-gray-900">
                {card.value}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;