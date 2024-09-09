import jwt from "jsonwebtoken";

const generateTokens = (user) => {
    const accessToken = jwt.sign(
        {
            userId: user._id,
            role: user.role,
        },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
        {
            userId: user._id,
        },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
};

const verifyAccessToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    } catch (error) {
        return null;
    }
};

const verifyRefreshToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
        return null;
    }
};

const verifyToken = (req, res, next) => {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
        return res.status(401).json({ error: 'Unauthorized access: No token provided' });
    }

    try {
        const decoded = verifyAccessToken(accessToken);
        if (!decoded) {
            setTimeout(() => {
                res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
            }, 100);
            return;
        }
        req.currentUser = decoded;
        next();
    } catch (error) {
        setTimeout(() => {
            res.status(401).json({ error: 'Unauthorized: Invalid token' });
        }, 100);
    }
};

export { generateTokens, verifyAccessToken, verifyRefreshToken, verifyToken };