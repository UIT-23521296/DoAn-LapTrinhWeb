const Blog = require('../models/Blog');

exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ msg: 'Blog not found' });

    blog.views += 1;
    await blog.save(); // lưu lại số lượt xem

    res.json(blog);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getMostViewedBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ views: -1 }).limit(5); // lấy top 5
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};


exports.createBlog = async (req, res) => {
  try {
    const { title, content } = req.body;
    const author = req.session.user.username; // lấy từ session

    if (!title || !content) {
      return res.status(400).json({ msg: 'Title and content are required' });
    }

    const newBlog = new Blog({ title, content, author });
    await newBlog.save();
    res.status(201).json({ msg: 'Blog created', blog: newBlog });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ msg: 'Blog not found' });

    if (blog.author !== req.session.user.username) {
      return res.status(403).json({ msg: 'Not authorized to edit this blog' });
    }

    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.updatedAt = new Date();

    await blog.save();
    res.json({ msg: 'Blog updated', blog });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ msg: 'Blog not found' });

    if (blog.author !== req.session.user.username) {
      return res.status(403).json({ msg: 'Not authorized to delete this blog' });
    }

    await blog.remove();
    res.json({ msg: 'Blog deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};
