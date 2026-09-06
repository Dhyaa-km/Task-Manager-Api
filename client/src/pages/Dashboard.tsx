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
import { BarChart, PieChart } from "@mui/x-charts";

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

  const totalTasks = stats.totalTasks;

  const completedPercentage =
    totalTasks > 0
      ? Math.round((stats.doneTasks / totalTasks) * 100)
      : 0;

  const remainingTasks = Math.max(
    totalTasks - stats.doneTasks,
    0
  );

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

      {/* Task Analytics */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Tasks by Status */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Tasks by Status
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Distribution of your current tasks.
            </p>
          </div>

          <div className="flex w-full justify-center overflow-hidden">
            <BarChart
              height={300}
              xAxis={[
                {
                  scaleType: "band",
                  data: [
                    "To Do",
                    "In Progress",
                    "Completed",
                  ],
                },
              ]}
              series={[
                {
                  data: [
                    stats.todoTasks,
                    stats.inProgressTasks,
                    stats.doneTasks,
                  ],
                },
              ]}
              borderRadius={6}
              grid={{ horizontal: true }}
              margin={{
                top: 20,
                right: 20,
                bottom: 40,
                left: 50,
              }}
            />
          </div>
        </div>

        {/* Task Completion */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Task Completion
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Percentage of tasks you have completed.
            </p>
          </div>

          <div className="relative flex items-center justify-center">
            <PieChart
              height={300}
              series={[
                {
                  data: [
                    {
                      id: "completed",
                      value: stats.doneTasks,
                      label: "Completed",
                    },
                    {
                      id: "remaining",
                      value: remainingTasks,
                      label: "Remaining",
                    },
                  ],
                  innerRadius: 75,
                  outerRadius: 110,
                  paddingAngle: 2,
                  cornerRadius: 5,
                },
              ]}
              margin={{
                top: 10,
                right: 10,
                bottom: 10,
                left: 10,
              }}
              hideLegend
            />

            {/* Center percentage */}
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-gray-900">
                {completedPercentage}%
              </span>

              <span className="mt-1 text-sm text-gray-500">
                Completed
              </span>
            </div>
          </div>

          {/* Donut legend */}
          <div className="mt-2 flex flex-wrap items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" />

              <span className="text-gray-600">
                Completed: {stats.doneTasks}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-gray-200" />

              <span className="text-gray-600">
                Remaining: {remainingTasks}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;