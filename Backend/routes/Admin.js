const express = require('express');
const router = express.Router();
const blogAdminController = require('../controllers/blogAdminController');
const requireAdmin = require('../middleware/requireAdmin');

// Route lấy danh sách bài chưa duyệt
router.get('/pending-blogs', requireAdmin, blogAdminController.getPendingBlogs);

// Route duyệt bài (approve)
router.put('/approve-blog/:id', requireAdmin, blogAdminController.approveBlog);

module.exports = router;
