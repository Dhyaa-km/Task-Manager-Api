const User = require("../../models/User");


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

module.exports = { logoutController }