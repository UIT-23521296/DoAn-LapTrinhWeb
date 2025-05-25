module.exports = (req, res, next) => {
    if (!req.session.user && !req.session.admin) {
        return res.redirect('/login');  
    }
    next(); 
}
