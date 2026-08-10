const express = require("express");
const router = express.Router();

const { adminDashboardController } = require("../../controllers/adminDashboardController");

const {verifyJWT} = require("../../middleware/verifyJWT");
const {verifyRoles} = require("../../middleware/verifyRoles");

router.get("/dashboard",
    verifyJWT,
    verifyRoles("admin"),
    adminDashboardController
);

module.exports = router;