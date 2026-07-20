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

module.exports = { createProject }