const User = require("../../models/User");
const jwt = require("jsonwebtoken");

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

module.exports = { handleRefreshToken }