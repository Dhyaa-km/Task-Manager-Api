const express = require("express");
const router = express.Router();

const { createTask, getAllTasks, getTaskById, patchTaskById, deleteTaskById } = require("../../controllers/taskController");
const { verifyJWT } = require("../../middleware/verifyJWT");

router.post("/projects/:projectId/tasks", verifyJWT, createTask);
router.get("/projects/:projectId/tasks", verifyJWT, getAllTasks);
// Individual task
router.get("/tasks/:taskId", verifyJWT, getTaskById);
router.patch("/tasks/:taskId", verifyJWT, patchTaskById);
router.delete("/tasks/:taskId", verifyJWT, deleteTaskById);

module.exports = router;