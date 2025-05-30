const Blog = require('../models/Blog');
const BlogContent = require('../models/BlogContent');
<<<<<<< HEAD
const User = require('../models/User');
=======
>>>>>>> 7b10084b05106cdabfefe00af2790c0afed5bc99

// Lấy danh sách bài blog chưa được duyệt
exports.getPendingBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ approved: false }).lean();
    
    const blogIds = blogs.map(blog => blog._id);
    const contents = await BlogContent.find({ blog: { $in: blogIds } }).lean();

    const contentMap = {};
    contents.forEach(c => {
      contentMap[c.blog.toString()] = c.content;
    });

    const result = blogs.map(blog => ({
      ...blog,
      content: contentMap[blog._id.toString()] || ''
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Lỗi khi lấy danh sách bài chưa duyệt' });
  }
};

// Duyệt bài blog (approve)
exports.approveBlog = async (req, res) => {
  try {
    const blogId = req.params.id;

    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ msg: 'Blog không tồn tại' });

    if (blog.approved) return res.status(400).json({ msg: 'Blog đã được duyệt trước đó' });

    blog.approved = true;
    await blog.save();

    res.json({ msg: 'Duyệt bài thành công', blog });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Lỗi khi duyệt bài' });
  }
};
// Ví dụ trong blogAdminController.js
exports.getBlogsForAdmin = async (req, res) => {
  try {
    const approvedBlogs = await Blog.find({ approved: true }).sort({ createdAt: -1 });
    const pendingBlogs = await Blog.find({ approved: false }).sort({ createdAt: -1 });

    res.json({ approvedBlogs, pendingBlogs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Lỗi khi lấy dữ liệu blog' });
  }
};

<<<<<<< HEAD
exports.getAdminStats = async (req, res) => {
  try {
    const totalDocuments = await Blog.countDocuments(); // tổng tài liệu
    const totalUsers = await User.countDocuments(); // tổng user đăng ký
    const pendingBlogs = await Blog.countDocuments({ approved: false }); // blog chưa duyệt

    res.json({
      totalDocuments,
      totalUsers,
      pendingBlogs
    });
  } catch (err) {
    console.error('Error getting stats:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
=======
>>>>>>> 7b10084b05106cdabfefe00af2790c0afed5bc99
