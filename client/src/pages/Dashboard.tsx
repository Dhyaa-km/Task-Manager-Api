import { useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  FolderKanban,
  Flame,
  ListTodo,
  RefreshCw,
} from "lucide-react";

import { getDashboardStats } from "../services/dashboardService";
import type { DashboardStats } from "../types/dashboard";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { user } = useAuth();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await getDashboardStats();

        setStats(data);
      } catch (error: any) {
        setError(
          error.response?.data?.message ||
            "Failed to load dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600" />

          <p className="text-sm text-gray-500">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex max-w-md items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

          <p className="text-sm font-medium">
            {error}
          </p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  // Calculate task progress percentages
  const totalTasks = stats.totalTasks;

  const todoPercentage =
    totalTasks > 0 ? (stats.todoTasks / totalTasks) * 100 : 0;

  const inProgressPercentage =
    totalTasks > 0
      ? (stats.inProgressTasks / totalTasks) * 100
      : 0;

  const completedPercentage =
    totalTasks > 0
      ? (stats.doneTasks / totalTasks) * 100
      : 0;

  const cards = [
    {
      title: "Total Projects",
      value: stats.totalProjects,
      icon: FolderKanban,
      iconClass: "bg-indigo-50 text-indigo-600",
    },
    {
      title: "Total Tasks",
      value: stats.totalTasks,
      icon: ListTodo,
      iconClass: "bg-blue-50 text-blue-600",
    },
    {
      title: "To Do",
      value: stats.todoTasks,
      icon: Clock3,
      iconClass: "bg-amber-50 text-amber-600",
    },
    {
      title: "In Progress",
      value: stats.inProgressTasks,
      icon: RefreshCw,
      iconClass: "bg-violet-50 text-violet-600",
    },
    {
      title: "Completed",
      value: stats.doneTasks,
      icon: CheckCircle2,
      iconClass: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Overdue",
      value: stats.overdueTasks,
      icon: AlertCircle,
      iconClass: "bg-red-50 text-red-600",
    },
    {
      title: "High Priority",
      value: stats.highPriorityTasks,
      icon: Flame,
      iconClass: "bg-orange-50 text-orange-600",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Welcome, {user?.username}
        </h1>

        <p className="mt-2 text-sm text-gray-500 sm:text-base">
          Here's an overview of your projects and tasks.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {card.title}
                  </p>

                  <p className="mt-3 text-3xl font-bold tracking-tight text-gray-900">
                    {card.value}
                  </p>
                </div>

                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-lg ${card.iconClass}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Task Progress */}
      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Task Progress
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Overview of your current task status.
          </p>
        </div>

        <div className="space-y-5">
          {/* To Do */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                To Do
              </span>

              <span className="text-sm font-semibold text-gray-900">
                {stats.todoTasks}
              </span>
            </div>

            <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-amber-500 transition-all duration-500"
                style={{ width: `${todoPercentage}%` }}
              />
            </div>
          </div>

          {/* In Progress */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                In Progress
              </span>

              <span className="text-sm font-semibold text-gray-900">
                {stats.inProgressTasks}
              </span>
            </div>

            <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-violet-500 transition-all duration-500"
                style={{ width: `${inProgressPercentage}%` }}
              />
            </div>
          </div>

          {/* Completed */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Completed
              </span>

              <span className="text-sm font-semibold text-gray-900">
                {stats.doneTasks}
              </span>
            </div>

            <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${completedPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;