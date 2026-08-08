const User = require("../models/User");
const Project = require("../models/Project");
const Task = require("../models/Task");

const adminDashboardController = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();

        const activeUsers = await User.countDocuments({
            status: "active"
        });

        const inactiveUsers = await User.countDocuments({
            status: "inactive"
        });

        const totalProjects = await Project.countDocuments();

        const totalTasks = await Task.countDocuments();

        const todoTasks = await Task.countDocuments({
            status: "todo"
        });

        const inProgressTasks = await Task.countDocuments({
            status: "in-progress"
        });

        const doneTasks = await Task.countDocuments({
            status: "done"
        });

        const overdueTasks = await Task.countDocuments({
            dueDate: { $lt: new Date() },
            status: { $ne: "done" }
        });

        const highPriorityTasks = await Task.countDocuments({
            priority: "high"
        });

        return res.status(200).json({
            totalUsers,
            activeUsers,
            inactiveUsers,
            totalProjects,
            totalTasks,
            todoTasks,
            inProgressTasks,
            doneTasks,
            overdueTasks,
            highPriorityTasks
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

module.exports = { adminDashboardController };