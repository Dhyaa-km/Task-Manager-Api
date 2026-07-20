const User = require("../../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleLogin = async (req , res) => {

    const { username, password, email} = req.body;

    if (!username || !password || !email) {
        return res.status(400).json({ message: "Username and password are required." });
    }

   const foundUser = await User.findOne({
    $or: [
        { username: login },
        { email: login }
    ]
});

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
    res.cookie('jwt', refreshToken, {
        httpOnly: true, //accessible only by web server
        secure: true, //https
        sameSite: 'None', //cross-site cookie
        maxAge: 24 * 60 * 60 * 1000 //cookie expiry date in ms = 1 day
    });

    // Send accessToken containing username and roles
    res.json({ accessToken });
}
module.exports = { handleLogin }