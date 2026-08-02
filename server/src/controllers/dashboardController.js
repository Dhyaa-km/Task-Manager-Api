const Project = require('../models/Project');
const Task = require('../models/Task');
const User = require('../models/User');
const emptyDashboard = {
    totalProjects: 0,
    totalTasks: 0,
    todoTasks: 0,
    inProgressTasks: 0,
    doneTasks: 0,
    overdueTasks: 0,
    highPriorityTasks: 0
}

const dashboardController = (req, res) => {

    const userId = req.user.id;


}

module.exports = { dashboardController }