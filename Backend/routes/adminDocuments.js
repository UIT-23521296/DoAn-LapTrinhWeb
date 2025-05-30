const express = require('express');
const router = express.Router();
const fs = require('fs').promises;     
const path = require('path');
const Document = require('../models/Document');

// Middleware kiểm tra quyền admin
const isAdmin = (req, res, next) => {
  if (req.session.admin && req.session.admin.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Access denied' });
};

// Lấy danh sách tài liệu đang chờ duyệt
router.get('/admin/documents/pending', isAdmin, async (req, res) => {
  try {
    const pendingDocs = await Document.find({ status: 'pending' }).sort({ uploadDate: -1 });
    res.json(pendingDocs);
  } catch (error) {
    console.error('Error fetching pending documents:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// API duyệt tài liệu (approve)
router.put('/admin/documents/approve/:id', isAdmin, async (req, res) => {
  try {
    const document = await Document.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    );

    if (!document) {
      return res.status(404).json({ message: 'Tài liệu không tồn tại' });
    }

    res.json({ message: 'Đã duyệt tài liệu', document });
  } catch (error) {
    console.error('Lỗi khi duyệt tài liệu:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// API từ chối tài liệu (reject)
router.delete('/admin/documents/reject/:id', isAdmin, async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Xoá file vật lý nếu có
    if (doc.fileUrl) {
      try {
        const filePath = path.join(__dirname, '..', doc.fileUrl);
        await fs.unlink(filePath);
      } catch (err) {
        console.error('Error deleting file:', err);
        // Không trả lỗi để vẫn tiếp tục xoá document
      }
    }

    // Xoá khỏi MongoDB
    await Document.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Document rejected and deleted' });
  } catch (error) {
    console.error('Reject failed:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


router.get('/admin/documents', isAdmin, async (req, res) => {
  try {
    const { status } = req.query;

    let filter = {};

    if (status && status !== 'all') {
      // Chỉ cho phép pending hoặc approved
      if (['pending', 'approved'].includes(status)) {
        filter.status = status;
      } else {
        // Nếu status khác các giá trị trên, trả lỗi
        return res.status(400).json({ message: 'Trạng thái không hợp lệ' });
      }
    } else {
      // Khi status = all hoặc không truyền, lấy tất cả ngoại trừ rejected
      filter.status = { $ne: 'rejected' };
    }

    const docs = await Document.find(filter).sort({ uploadDate: -1 });
    res.json(docs);
  } catch (err) {
    console.error('Lỗi lấy danh sách tài liệu:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});



module.exports = router;
