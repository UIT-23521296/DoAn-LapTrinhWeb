const express = require('express');
const router = express.Router();

const blogController = require('../controllers/blogController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', blogController.getAllBlogs);
router.get('/:id', blogController.getBlogById);

router.post('/', authMiddleware, blogController.createBlog);
router.put('/:id', authMiddleware, blogController.updateBlog);
router.delete('/:id', authMiddleware, blogController.deleteBlog);

router.get('/top/viewed', blogController.getMostViewedBlogs); 

module.exports = router;
