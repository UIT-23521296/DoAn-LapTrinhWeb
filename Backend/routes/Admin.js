const express = require('express');
const router = express.Router();
const blogAdminController = require('../controllers/blogAdminController');
const requireAdmin = require('../middleware/requireAdmin');

// Route lấy danh sách bài chưa duyệt
router.get('/pending-blogs', requireAdmin, blogAdminController.getPendingBlogs);

// Route duyệt bài (approve)
router.put('/approve-blog/:id', requireAdmin, blogAdminController.approveBlog);

router.get('/blogs', requireAdmin, blogAdminController.getBlogsForAdmin);

<<<<<<< HEAD
router.get('/stats', requireAdmin, blogAdminController.getAdminStats);

=======
>>>>>>> 7b10084b05106cdabfefe00af2790c0afed5bc99
module.exports = router;
