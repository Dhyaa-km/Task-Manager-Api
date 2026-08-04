const Project = require('../models/Project');
const Task = require('../models/Task');
const emptyDashboard = {
    totalProjects: 0,
    totalTasks: 0,
    todoTasks: 0,
    inProgressTasks: 0,
    doneTasks: 0,
    overdueTasks: 0,
    highPriorityTasks: 0
}

const dashboardController = async (req, res) => {
    try {
        
        const userId = req.user.id;

        const projects = await Project.find({
            owner: userId
        }).select("_id");
        if(projects.length === 0) return res.status(404).json( emptyDashboard );

        const projectId = projects.map(project => project._id);

        const totalProjects = projects.length;

        const totalTasks = await Task.countDocuments({
            project: {
                $in: projectId
            }
        });

        const todoTasks = await Task.countDocuments({
            project: {
                $in: projectId
            },
            status: "todo"
        });

        const inProgressTasks = await Task.countDocuments({
            project: {
                $in: projectId
            },
            status: "in-Progress"
        });

        const doneTasks = await Task.countDocuments({
            project: {
                $in: projectId
            },
            status: "done"
        });

        const highPriorityTasks = await Task.countDocuments({
            project: {
                $in: projectId
            },
            priority: "high"
        });

        const overdueTasks = await Task.countDocuments({
            project: {
                $in: projectId
            },
            dueDate: {
                $lt: new Date()
            },
            status: {
                $ne: "done"
            }
        })

        return res.status(200).json({
            totalProjects,
            totalTasks,
            todoTasks,
            inProgressTasks,
            doneTasks,
            overdueTasks,
            highPriorityTasks
        })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = { dashboardController }