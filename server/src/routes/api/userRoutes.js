const express = require("express");
const router = express.Router();

const { getMe, updateMe, updatePassword, getAllUsers, getUserById, updateUserById, deleteUser } = require("../../controllers/userController");
const { dashboardController } = require("../../controllers/dashboardController");
const { verifyJWT } = require("../../middleware/verifyJWT");
const { verifyRoles } = require("../../middleware/verifyRoles");

// current user
router.get("/me", verifyJWT, getMe);
router.get("/dashboard", verifyJWT, dashboardController);

router.patch("/me", verifyJWT, updateMe);
router.patch("/password", verifyJWT, updatePassword);

// admin user management
router.get("/", verifyJWT, verifyRoles("admin"), getAllUsers);
router.get("/:userId", verifyJWT, verifyRoles("admin"), getUserById);
router.patch("/:userId", verifyJWT, verifyRoles("admin"), updateUserById);
router.delete("/:userId", verifyJWT, verifyRoles("admin"), deleteUser);

module.exports = router;