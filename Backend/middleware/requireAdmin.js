module.exports = (req, res, next) => {
    if (req.session.admin && req.session.admin.role === 'admin') {
        next(); 
    } else if (!req.session.user) {
        res.status(403).send('Truy cập bị từ chối: Không có quyền admin.');
    } else {
        res.status(403).send('Truy cập bị từ chối: Không có quyền admin.');
    }
};
