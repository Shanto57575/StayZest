const isAdmin = (req, res, next) => {
    const userRole = req.currentUser.role;
    if (userRole && (userRole === 'ADMIN' || userRole === 'SUPER_ADMIN')) {
        next()
    }
    else {
        res.status(403).json({ error: "Unauthorized Access" })
    }
}

const isSUPER_ADMIN = (req, res, next) => {
    if (req.currentUser && req.currentUser.role === 'SUPER_ADMIN') {
        next()
    }
    else {
        res.status(403).json({ error: "Access Denied! Contact Super_Admin" })
    }
}

export {
    isAdmin,
    isSUPER_ADMIN
}