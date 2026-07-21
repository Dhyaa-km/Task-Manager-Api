const Task = require("../models/Task");
const Project = require("../models/Project");
const allowedPriorities = ["low", "medium", "high"];

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

        const existingProject = await Project.findOne({
            _id: req.params.projectId,
            owner: req.user.id
        }).exec();
        if (!existingProject) return res.status(404).json({ message: "Project not found" });

        const { projectId } = req.params;
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
            project: req.params.projectId,
        });
        return res.status(201).json(task);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }


}
module.exports = { createTask }