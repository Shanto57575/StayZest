import jwt from "jsonwebtoken";

const generateToken = (res, user) => {
    const token = jwt.sign(
        {
            userId: user._id,
            role: user.role
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: '3d' }
    );

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
        maxAge: 3 * 24 * 60 * 60 * 1000,
        path: '/'
    });
}

const verifyToken = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.currentUser = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Unauthorized: Token expired' });
        }
        console.error(`Token Verification Failed: ${error.message}`);
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
}

export { generateToken, verifyToken };
