const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv").config()
const PORT = process.env.PORT || 3000;

const adminRoutes = require("./routes/api/adminRoutes");
const authRoutes = require("./routes/api/authRoutes");
const projectRoutes = require("./routes/api/projectRoutes");
const taskRoutes = require("./routes/api/taskRoutes");
const userRoutes = require("./routes/api/userRoutes");

app.use(cors());
app.use(express.json());


// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);


app.get('/', (req, res) => {
    res.send("Backend server is running!");
})

app.listen(PORT, () => {
    console.log(`Backend server is running on port ${PORT}!`);
});