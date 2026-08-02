const Project = require("../models/Project");


const createProject = async (req, res) => { 

    const title = req.body.title?.trim();
    const description = req.body.description?.trim();

    if (!title || !description) {
        return res.status(400).json({ message: "Title and description are required." });
    }

    if (title.length < 3) {
        return res.status(400).json({ message: "Title must be at least 3 characters long." });
    }

    if (description.length < 10) {
        return res.status(400).json({ message: "Description must be at least 10 characters long." });
    }

    try {
        const project = await Project.create(
            {
                title,
                description,
                owner: req.user.id
            }
        );
        return res.status(201).json(project);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const getAllProjects = async (req, res) => {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;

    if (page < 1 || limit < 1 || limit > 100) {
        return res.status(400).json({
            message: "Invalid pagination values"
        });
    }

    const skip = (page - 1) * limit;
    try {
        const projects = await Project.find({ owner: req.user.id })
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const totalProjects = await Project.countDocuments({ owner: req.user.id });

        const totalPages = Math.ceil(totalProjects / limit);

        return res.status(200).json({
            projects,
            currentPage: page,
            totalPages,
            totalProjects,
            limit
        });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const getProjectById = async (req, res) => {

    const id = req.params.id;

    try {
        const project = await Project.findById(id).exec();
        if (!project) return res.status(404).json({ message: "Project not found" });
        if (project.owner.toString() !== req.user.id) return res.status(403).json({ message: "forbidden" });

        return res.status(200).json(project);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const patchProjectById = async (req, res) => {

    const {id} = req.params

    try {
        // Find the project that belongs to the authenticated user
        const project = await Project.findOne({
            _id: id,
            owner: req.user.id
        });

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        // Update title if provided
        if (req.body.title !== undefined) {
            const title = req.body.title.trim();

            if (title.length < 3) {
                return res.status(400).json({
                    message: "Title must be at least 3 characters long."
                });
            }

            project.title = title;
        }

        // Update description if provided
        if (req.body.description !== undefined) {
            const description = req.body.description.trim();

            if (description.length < 10) {
                return res.status(400).json({
                    message: "Description must be at least 10 characters long."
                });
            }

            project.description = description;
        }

        // Update status if provided
        if (req.body.status !== undefined) {
            if (!["active", "inactive"].includes(req.body.status)) {
                return res.status(400).json({
                    message: "Invalid status."
                });
            }

            project.status = req.body.status;
        }

        await project.save();

        return res.status(200).json(project);

    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
}

const deleteProjectById = async (req, res) => {

    const {id} = req.params

    try {
        const project = await Project.findOne({
            _id: id,
            owner: req.user.id
        });

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }
        await project.deleteOne();

        return res.sendStatus(204);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports = {
    createProject,
    getAllProjects,
    getProjectById,
    patchProjectById,
    deleteProjectById
};