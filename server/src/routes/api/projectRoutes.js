const express = require("express");
const router = express.Router();

const { createProject, getAllProjects, getProjectById, patchProjectById, deleteProjectById } = require("../../controllers/projectController");
const { verifyJWT } = require("../../middleware/verifyJWT");

router.post("/", verifyJWT, createProject);
router.get("/", verifyJWT, getAllProjects);
router.get("/:id", verifyJWT, getProjectById);
router.patch("/:id", verifyJWT, patchProjectById);
router.delete("/:id", verifyJWT, deleteProjectById);

module.exports = router;