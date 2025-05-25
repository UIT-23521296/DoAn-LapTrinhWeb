module.exports = (req, res, next) => {
    console.log(req.session.admin.role);
    if (req.session.admin && req.session.admin.role === 'admin') {
        next(); 
    } else {
        res.status(403).send('Truy cập bị từ chối: Không có quyền admin.');
    }
};
