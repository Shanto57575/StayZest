const isAdmin = (req, res, next) => {
    console.log(req.user.role)
    if (req.user && req.user.role === 'ADMIN') {
        next()
    }
    else {
        res.status(403).json({ error: "Unauthorize Access" })
    }
}

export default isAdmin