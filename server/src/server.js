const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv").config()
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send("Backend server is running!");
})

app.listen(PORT, () => {
    console.log(`Backend server is running on port ${PORT}!`);
});