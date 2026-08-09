const express = require("express");
const router = express.Router();

const { handleRegister, handleLogin, handleRefreshToken, logoutController } = require("../../controllers/authController");
const { verifyJWT } = require("../../middleware/verifyJWT");
const { verifyRoles } = require("../../middleware/verifyRoles");

router.post("/register", handleRegister);
router.post("/login", handleLogin);
router.get("/refresh", handleRefreshToken);
router.get("/logout", verifyJWT, logoutController);

module.exports = router;