module.exports = (req, res, next) => {
    if (!req.session.user) {
        res.redirect('/login');  // Redirect về trang login
    }
    next();
}