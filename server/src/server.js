require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");


const connectDB = require("./config/dbConn");

const adminRoutes = require("./routes/api/adminRoutes");
const authRoutes = require("./routes/api/authRoutes");
const projectRoutes = require("./routes/api/projectRoutes");
const taskRoutes = require("./routes/api/taskRoutes");
const userRoutes = require("./routes/api/userRoutes");

const app = express();

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);

// Root route
app.get("/", (req, res) => {
    res.send("Backend server is running!");
});

// Start server after connecting to MongoDB
const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Backend server is running on port ${PORT}!`);
        });
    } catch (error) {
        console.error("Server startup error:", error.message);
    }
};

startServer();