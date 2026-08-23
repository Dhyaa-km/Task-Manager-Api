const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

const handleLogin = async (req , res) => {

    const { username, password, email} = req.body;

    if ((!username && !email) || !password) {
        return res.status(400).json({
            message: "Username or email and password are required."
        });
    }

    const loginField = username
        ? { username }
        : { email };

   const foundUser = await User.findOne(loginField).exec();

    if (!foundUser) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const match = await bcrypt.compare(password, foundUser.password);

    if (!match) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const accessToken = jwt.sign(
        {
            "UserInfo": {
                id: foundUser._id,
                "username": foundUser.username,
                "role": foundUser.role
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1h" }
    );
    const refreshToken = jwt.sign(
        {
            "username": foundUser.username,
            id: foundUser._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
    );

    foundUser.refreshToken = refreshToken;
    await foundUser.save();

    // Create secure cookie with refresh token
    res.cookie("jwt", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 24 * 60 * 60 * 1000
    });

    // Send accessToken containing username and roles
    res.json({ accessToken });
}

const handleRefreshToken = async (req, res) => {

    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);

    const refreshToken = cookies.jwt;

    try {
        const foundUser = await User.findOne({ refreshToken }).exec();
        if (!foundUser) return res.sendStatus(403); // Forbidden
        
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (err, decoded) => {
                if (err || foundUser.username !== decoded.username ) return res.sendStatus(403);

                const accessToken = jwt.sign(
                    {
                        "UserInfo": {
                            id: foundUser._id,
                            username: foundUser.username,
                            role: foundUser.role
                        }
                    },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '15m' }
                );
                return res.json({ accessToken });
            }
        );
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const logoutController = async (req, res) => {

    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); // No content

    const refreshToken = cookies.jwt;

    try {
        const foundUser = await User.findOne({ refreshToken }).exec();
        if (!foundUser) { 
            res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
            return res.sendStatus(204); // No content
        }

        foundUser.refreshToken = "";
        await foundUser.save();

        res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
        return res.sendStatus(204);
        
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

module.exports = { handleRegister, handleLogin, handleRefreshToken, logoutController };