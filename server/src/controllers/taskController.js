const Task = require("../models/Task");
const Project = require("../models/Project");
const allowedPriorities = ["low", "medium", "high"];
const allowedStatuses = ["todo", "in-progress", "done"];

const createTask = async (req, res) => {

    const title = req.body.title?.trim();
    const description = req.body.description?.trim();
    const priority = req.body.priority;
    const dueDate = req.body.dueDate;

    if (!title || !description) return res.status(400).json({ message: "Title and description are required." });

    if (title.length < 3) return res.status(400).json({ message: "Title must be at least 3 characters long." });
    
    if (description.length < 10) return res.status(400).json({ message: "Description must be at least 10 characters long." });

    if (!allowedPriorities.includes(priority)) {
        return res.status(400).json({
            message: "Invalid priority."
        });
    }

    if (!dueDate) return res.status(400).json({ message: "Due date is required." });

    const parsedDueDate = new Date(dueDate);
    if (parsedDueDate.getTime() <= Date.now()) return res.status(400).json({ message: "Due date must be in the future." });

    try {

        const { projectId } = req.params;
        
        const existingProject = await Project.findOne({
            _id: projectId,
            owner: req.user.id
        }).exec();
        if (!existingProject) return res.status(404).json({ message: "Project not found" });

        const existingTask = await Task.findOne({
            title,
            project: projectId
        })
        if (existingTask) return res.status(409).json({ message: "Task already exists" });

        const task = await Task.create({
            title,
            description,
            priority,
            dueDate,
            project: projectId
        });
        return res.status(201).json(task);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }


}

const getAllTasks = async (req, res) => {

    try {
        
        
        const projectId = req.params.projectId;
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        
        if (page < 1 || limit < 1 || limit > 100) {
            return res.status(400).json({
                message: "Invalid pagination values"
            });
        }
        
        const project = await Project.findOne({
            _id: projectId,
            owner: req.user.id
        }).exec();
        if(!project) return res.status(404).json({ message: "Project not found" });
        
        const skip = (page - 1) * limit;

        let filter = { project: projectId };

        if (
            req.query.status &&
            !allowedStatuses.includes(req.query.status)
        ) {
            return res.status(400).json({
                message: "Invalid status."
            });
        }

        if (req.query.status) {
            filter.status = req.query.status;
        }

        const tasks = await Task.find(filter)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const totalTasks = await Task.countDocuments(filter);

        const totalPages = Math.ceil(totalTasks / limit);

        return res.status(200).json({
            tasks,
            currentPage: page,
            totalPages,
            totalTasks,
            limit
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

}

const getTaskById = async (req, res) => {
    const {taskId} = req.params

    try { 

        const task = await Task.findOne(taskId).exec();
        if (!task) return res.status(404).json({ message: "Task not found" });
        
        const project = await Project.findOne({
            _id: task.project,
            owner: req.user.id
        }).exec();
        if (!project) return res.status(403).json({ message: "forbidden" });

        return res.status(200).json(task);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = { createTask, getAllTasks }