const User = require("../models/User");
const Project = require("../models/Project");
const Task = require("../models/Task");
const bcrypt = require("bcrypt");
const allowedStatuses = ["active", "inactive"];
const allowedRoles = ["user", "admin"];
const mongoose = require('mongoose');

const getMe = async (req, res) => {

    try {
        const user = await User.findById(req.user.id).exec();
        if (!user) return res.status(404).json({ message: "User not found" });

        return res.status(200).json(
            {
                username: user.username,
                email: user.email,
                role: user.role,
                status: user.status,
                avatar: user.avatar
            }
        )
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const updateMe = async (req, res) => {
    try {
        const username = req.body.username?.trim();
        const email = req.body.email?.trim();
        const avatar = req.body.avatar?.trim();

        if (username && username.length < 3) return res.status(400).json({ message: "Username must be at least 3 characters long." });

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email && !emailRegex.test(email)) return res.status(400).json({ message: "Invalid email format." });

        const user = await User.findById(req.user.id).exec();
        if (!user) return res.status(404).json({ message: "User not found" });

        if (username) user.username = username;

        // if email is provided, check if it's unique
        if(email) {
            const existingEmail = await User.findOne({
                email,
                _id: { $ne: req.user.id }
            }).exec();
            if (existingEmail) return res.status(409).json({ message: "email already exists" });
            user.email = email;
        }

        if (avatar) user.avatar = avatar;

        await user.save();
        return res.status(200).json({ 
            username: user.username,
            email: user.email,
            avatar: user.avatar
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) return res.status(400).json({ message: "Current password and new password are required." });

        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

        if (!passwordRegex.test(newPassword)) {
            return res.status(400).json({
                message: "New password must be at least 8 characters and contain at least one letter and one number."
            });
        } 

        const user = await User.findById(req.user.id).exec();
        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(401).json({ message: "Current password is incorrect." });

        const isSamePassword = await bcrypt.compare(newPassword, user.password);
        if (isSamePassword) return res.status(400).json({ message: "New password cannot be the same as the current password." });

        const hashedPassword = await bcrypt.hash(newPassword, 10)

        user.password = hashedPassword;

        await user.save();

        return res.status(200).json({ message: "Password updated successfully." });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const getAllUsers = async (req, res) => {
    try {
        
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        
        if (page < 1 || limit < 1 || limit > 100) {
            return res.status(400).json({
                message: "Invalid pagination values"
            });
        }
        
        const status = req.query.status
        if (status && !allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid status."
            });
        }

        let filter = {};
        if (status) { filter.status = status; }
        
        const totalUsers = await User.countDocuments(filter);
        const totalPages = Math.ceil(totalUsers / limit);
        
        const skip = (page - 1) * limit;

        const users = await User.find(filter)
            .select("-password -refreshToken")
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })
            .exec();
        if (!users) return res.status(404).json({ message: "Users not found" });

        const paginatedUsers = users.map(user => ({
            _id: user._id,
            username: user.username,
            email: user.email,
            avatar: user.avatar,
            status: user.status,
            createdAt: user.createdAt
        }));

        return res.status(200).json({
            users: paginatedUsers,
            currentPage: page,
            totalPages,
            totalUsers,
            limit
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const getUserById = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!mongoose.isValidObjectId(userId)) return res.status(400).json({ message: "Invalid user ID" });

        const user = await User.findById(userId).exec();
        if (!user) return res.status(404).json({ message: "User not found" });


        return res.status(200).json({
            username: user.username,
            email: user.email,
            avatar: user.avatar,
            status: user.status,
            role: user.role,
            createdAt: user.createdAt
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const updateUserById = async (req, res) => {
    try {
        const { userId } = req.params;
        const { role, status } = req.body;
        if (!mongoose.isValidObjectId(userId)) return res.status(400).json({ message: "Invalid user ID" });

        if (role && !allowedRoles.includes(role)) return res.status(400).json({ message: "Invalid role" });

        if (status && !allowedStatuses.includes(status)) return res.status(400).json({ message: "Invalid status" });

        const user = await User.findById(userId).exec();
        if (!user) return res.status(404).json({ message: "User not found" });

        // Prevent an admin from deactivating themselves
        if ( user._id.toString() === req.user.id && status === "inactive" ) {
            return res.status(400).json({
                message: "You cannot deactivate your own account."
            });
        }

        // Prevent an admin from removing their own admin role
        if (user._id.toString() === req.user.id && role === "user" ) {
            return res.status(400).json({
                message: "You cannot remove your own admin role."
            });
        }

        // Prevent removing the last admin
        if ( role === "user" &&  user.role === "admin" ) {
            const adminCount = await User.countDocuments({
                role: "admin"
            });

            if (adminCount === 1) {
                return res.status(400).json({
                    message: "You cannot remove the last admin."
                });
            }
        }

        if (role) user.role = role;
        if (status) user.status = status;

        await user.save();

        return res.status(200).json({
            username: user.username,
            email: user.email,
            avatar: user.avatar,
            status: user.status,
            role: user.role,
            createdAt: user.createdAt
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;

        // Validate user ID
        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).json({
                message: "Invalid user ID."
            });
        }

        // Find target user
        const user = await User.findById(userId).exec();

        if (!user) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        // Prevent admin from deleting themselves
        if (user._id.toString() === req.user.id) {
            return res.status(403).json({
                message: "You cannot delete your own account."
            });
        }

        // Prevent deleting the last admin
        if (user.role === "admin") {
            const adminCount = await User.countDocuments({
                role: "admin"
            });

            if (adminCount === 1) {
                return res.status(400).json({
                    message: "Cannot delete the last admin."
                });
            }
        }

        // Find user's projects
        const projects = await Project.find({
            owner: userId
        }).select("_id").exec();

        const projectIds = projects.map(project => project._id);

        // Delete tasks belonging to those projects
        if (projectIds.length > 0) {
            await Task.deleteMany({
                project: { $in: projectIds }
            });
        }

        // Delete user's projects
        await Project.deleteMany({
            owner: userId
        });

        // Delete user
        await User.deleteOne({
            _id: userId
        });

        return res.sendStatus(204);

    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
};

module.exports = { getMe, updateMe, updatePassword, getAllUsers, getUserById, updateUserById, deleteUser };