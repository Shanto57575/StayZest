import jwt from "jsonwebtoken"

const generateToken = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, { expiresIn: '6h' })
    res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000,
    })
}

const verifyToken = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized Access: No Token Provided' })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded
        next()
    } catch (error) {
        console.log(`Token verification Error : `, error);
        return res.status(401).json({ error: 'Unauthorized Access: Invalid Token' })
    }
}

export { generateToken, verifyToken }