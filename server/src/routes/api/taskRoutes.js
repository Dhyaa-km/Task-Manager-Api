const express = require("express");
const router = express.Router();

const { createTask, getAllTasks, getTaskById, patchTaskById, deleteTaskById } = require("../../controllers/taskController");
const { verifyJWT } = require("../../middleware/verifyJWT");
const validateObjectId  = require("../../middleware/validateObjectId");

router.post("/projects/:projectId/tasks", verifyJWT, validateObjectId("projectId"), createTask);
router.get("/projects/:projectId/tasks", verifyJWT, validateObjectId("projectId"), getAllTasks);
// Individual task
router.get("/tasks/:taskId", verifyJWT, validateObjectId("taskId"), getTaskById);
router.patch("/tasks/:taskId", verifyJWT, validateObjectId("taskId"), patchTaskById);
router.delete("/tasks/:taskId", verifyJWT, validateObjectId("taskId"), deleteTaskById);

module.exports = router;