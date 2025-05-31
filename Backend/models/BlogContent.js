const mongoose = require('mongoose');

const blogContentSchema = new mongoose.Schema({
  blog: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog', required: true },
  content: { type: String, required: true }, // HTML string hoặc Markdown
  imageUrls: [{ type: String }], // link ảnh nhúng trong content nếu cần
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BlogContent', blogContentSchema);
