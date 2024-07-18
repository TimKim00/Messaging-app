const validateSession = (req, res, next) => {
    if (!req.isAuthenticated()) {
        const err = new Error("Authentication invalid");
        err.status = 401;
        next(err);
    }
    next();
}

module.exports = validateSession;


