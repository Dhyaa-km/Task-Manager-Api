const User = require("../../models/User");
const bcrypt = require("bcrypt");

const handleRegister = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: "Username, email, and password are required." });
    }
    
    try {
        const existingEmail = await User.findOne({ email }).exec();
        if (existingEmail) {
            return res.status(409).json({ message: "email already exists" });
        }
    
        const existingUsername = await User.findOne({ username }).exec();
        if (existingUsername) {
            return res.status(409).json({ message: "username already exists" });
        }
    
        const hashedPassword = await bcrypt.hash(password, 10);
    
        await User.create({
            username,
            email,
            password: hashedPassword
        });

        res.status(201).json({ message: "User Created Successfully" });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

module.exports = { handleRegister }