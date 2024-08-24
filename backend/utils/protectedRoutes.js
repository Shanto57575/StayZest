const isAdmin = (req, res, next) => {
    if (req.currentUser && req.currentUser.role === 'ADMIN') {
        next()
    }
    else {
        res.status(403).json({ error: "Unauthorized Access" })
    }
}

export default isAdmin