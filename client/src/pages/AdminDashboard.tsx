import { useEffect, useState } from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import {
  AlertCircle,
  CheckCircle2,
  CircleAlert,
  ClipboardList,
  FolderKanban,
  ShieldCheck,
  UserCheck,
  UserRound,
  UserX,
} from "lucide-react";

import { getAdminDashboardStats } from "../services/adminDashboardService";
import type { AdminDashboardStats } from "../types/adminDashboard";
import { useAuth } from "../context/AuthContext";

function AdminDashboard() {
  const { user } = useAuth();

  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

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
      <div className="flex min-h-[calc(100vh-2rem)] items-center justify-center p-6">
        <div className="ui-card w-full max-w-md p-8 text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600" />
          <p className="mt-4 text-sm text-gray-500">
            Loading admin dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl p-6">
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

          <div>
            <p className="font-medium">Unable to load dashboard</p>
            <p className="mt-1 text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const taskStatusTotal =
    stats.todoTasks + stats.inProgressTasks + stats.doneTasks;

  const userStatusTotal = stats.activeUsers + stats.inactiveUsers;

  const getPercentage = (value: number, total: number) => {
    if (total === 0) return 0;

    return Math.round((value / total) * 100);
  };

  const mainCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: UserRound,
      iconClass: "bg-indigo-100 text-indigo-600",
    },
    {
      title: "Active Users",
      value: stats.activeUsers,
      icon: UserCheck,
      iconClass: "bg-green-100 text-green-600",
    },
    {
      title: "Total Projects",
      value: stats.totalProjects,
      icon: FolderKanban,
      iconClass: "bg-blue-100 text-blue-600",
    },
    {
      title: "Total Tasks",
      value: stats.totalTasks,
      icon: ClipboardList,
      iconClass: "bg-indigo-100 text-indigo-600",
    },
    {
      title: "Completed Tasks",
      value: stats.doneTasks,
      icon: CheckCircle2,
      iconClass: "bg-green-100 text-green-600",
    },
    {
      title: "Overdue Tasks",
      value: stats.overdueTasks,
      icon: CircleAlert,
      iconClass: "bg-red-100 text-red-600",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-2">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
            <ShieldCheck className="h-6 w-6" />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Admin Dashboard
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Welcome back, {user?.username || "Admin"}
            </p>
          </div>
        </div>
      </div>

      {/* Main Statistics */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Overview
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            A quick overview of your platform.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {mainCards.map((card) => {
            const Icon = card.icon;

            return (
              <div key={card.title} className="ui-card p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-gray-500">{card.title}</p>

                    <p className="mt-2 text-2xl font-bold text-gray-900">
                      {card.value}
                    </p>
                  </div>

                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${card.iconClass}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Charts */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Statistics
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Visual breakdown of users and tasks.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Task Status Chart */}
          <div className="ui-card p-5 sm:p-6">
            <div>
              <h3 className="font-semibold text-gray-900">
                Task Status
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Distribution of tasks by their current status.
              </p>
            </div>

            <div className="mt-4">
              {taskStatusTotal === 0 ? (
                <div className="flex h-65 items-center justify-center text-sm text-gray-500">
                  No tasks available yet.
                </div>
              ) : (
                <PieChart
                  series={[
                    {
                      data: [
                        {
                          id: 0,
                          value: stats.todoTasks,
                          label: "To Do",
                          color: "#f59e0b",
                        },
                        {
                          id: 1,
                          value: stats.inProgressTasks,
                          label: "In Progress",
                          color: "#3b82f6",
                        },
                        {
                          id: 2,
                          value: stats.doneTasks,
                          label: "Completed",
                          color: "#22c55e",
                        },
                      ],
                      innerRadius: 60,
                      outerRadius: 95,
                      paddingAngle: 2,
                      cornerRadius: 4,
                    },
                  ]}
                  height={260}
                />
              )}
            </div>

            {/* Custom Legend */}
            <div className="mt-2 grid grid-cols-3 gap-3">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                  <span className="text-xs text-gray-500">To Do</span>
                </div>

                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {stats.todoTasks}
                </p>

                <p className="text-xs text-gray-400">
                  {getPercentage(stats.todoTasks, taskStatusTotal)}%
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                  <span className="text-xs text-gray-500">
                    In Progress
                  </span>
                </div>

                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {stats.inProgressTasks}
                </p>

                <p className="text-xs text-gray-400">
                  {getPercentage(
                    stats.inProgressTasks,
                    taskStatusTotal
                  )}
                  %
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                  <span className="text-xs text-gray-500">
                    Completed
                  </span>
                </div>

                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {stats.doneTasks}
                </p>

                <p className="text-xs text-gray-400">
                  {getPercentage(stats.doneTasks, taskStatusTotal)}%
                </p>
              </div>
            </div>
          </div>

          {/* User Status Chart */}
          <div className="ui-card p-5 sm:p-6">
            <div>
              <h3 className="font-semibold text-gray-900">
                User Status
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Distribution of active and inactive users.
              </p>
            </div>

            <div className="mt-4">
              {userStatusTotal === 0 ? (
                <div className="flex h-65 items-center justify-center text-sm text-gray-500">
                  No users available yet.
                </div>
              ) : (
                <PieChart
                  series={[
                    {
                      data: [
                        {
                          id: 0,
                          value: stats.activeUsers,
                          label: "Active",
                          color: "#22c55e",
                        },
                        {
                          id: 1,
                          value: stats.inactiveUsers,
                          label: "Inactive",
                          color: "#9ca3af",
                        },
                      ],
                      innerRadius: 60,
                      outerRadius: 95,
                      paddingAngle: 2,
                      cornerRadius: 4,
                    },
                  ]}
                  height={260}
                />
              )}
            </div>

            {/* Custom Legend */}
            <div className="mt-2 grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                  <span className="text-xs text-gray-500">Active</span>
                </div>

                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {stats.activeUsers}
                </p>

                <p className="text-xs text-gray-400">
                  {getPercentage(stats.activeUsers, userStatusTotal)}%
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-gray-400" />
                  <span className="text-xs text-gray-500">
                    Inactive
                  </span>
                </div>

                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {stats.inactiveUsers}
                </p>

                <p className="text-xs text-gray-400">
                  {getPercentage(
                    stats.inactiveUsers,
                    userStatusTotal
                  )}
                  %
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Attention Needed */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Attention Needed
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Items that may require administrator attention.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-red-200 bg-red-50 p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600">
                <CircleAlert className="h-5 w-5" />
              </div>

              <div>
                <p className="font-semibold text-red-900">
                  Overdue Tasks
                </p>

                <p className="mt-1 text-2xl font-bold text-red-700">
                  {stats.overdueTasks}
                </p>

                <p className="mt-1 text-sm text-red-600">
                  Tasks have passed their due date.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-orange-200 bg-orange-50 p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                <ClipboardList className="h-5 w-5" />
              </div>

              <div>
                <p className="font-semibold text-orange-900">
                  High Priority Tasks
                </p>

                <p className="mt-1 text-2xl font-bold text-orange-700">
                  {stats.highPriorityTasks}
                </p>

                <p className="mt-1 text-sm text-orange-600">
                  High priority tasks need attention.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AdminDashboard;