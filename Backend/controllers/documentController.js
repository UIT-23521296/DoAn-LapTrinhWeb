const Document = require('../models/Document');

/**
 * Controller xử lý upload tài liệu
 */
exports.uploadDocument = async (req, res) => {
  console.log('👉 uploadDocument được gọi, session.user =', req.session.user);
  try {
    // Kiểm tra người dùng trong session (bắt buộc sau authMiddleware)
    const uploader = req.session.user?.username;
    if (!uploader) {
      return res.status(401).json({ error: 'Chưa đăng nhập' });
    }

    const { title, subjectType, subjectName, documentType, description } = req.body;

    // Validate file và các trường bắt buộc
    if (!req.file) {
      return res.status(400).json({ error: 'Chưa upload file' });
    }
    if (!title || !subjectType || !subjectName || !documentType) {
      return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
    }

    // Lấy username làm uploader thay vì hardcode

    // Tạo document mới
    const newDoc = new Document({
      title,
      description: description || '',
      subjectType,
      subjectName,
      documentType,
      uploader,
      fileUrl: req.file.path,
      status: 'pending',
      uploadDate: new Date()
    });

    // Lưu vào MongoDB
    await newDoc.save();

    return res.status(201).json({ message: 'Upload thành công', document: newDoc });
  } catch (err) {
    console.error('uploadDocument error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Controller lấy danh sách tài liệu đang chờ duyệt hoặc đã duyệt
 * - Admin: trả về tất cả theo status
 * - User thường: chỉ trả tài liệu do họ upload
 */
exports.getDocumentsByStatus = async (req, res) => {
  try {
    const session = req.session;
    const { status } = req.query;
    const validStatuses = ['all', 'pending', 'approved'];
    let filter = {};

    // Build filter theo status
    if (validStatuses.includes(status)) {
      if (status !== 'all') filter.status = status;
    } else {
      filter.status = 'pending';
    }

    // Nếu user thường (không phải admin), giới hạn theo uploader
    if (!session.admin) {
      const user = session.user;
      if (!user || !user.username) {
        return res.status(401).json({ error: 'Chưa đăng nhập' });
      }
      filter.uploader = user.username;
    }

    const docs = await Document.find(filter)
      .sort({ uploadDate: -1 })
      .lean();

    return res.json(docs);
  } catch (error) {
    console.error('getDocumentsByStatus error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Controller phê duyệt tài liệu
 */
exports.approveDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const session = req.session;

    if (!session.admin) {
      return res.status(403).json({ message: 'Không có quyền' });
    }

    const doc = await Document.findById(id);
    if (!doc) return res.status(404).json({ message: 'Tài liệu không tồn tại' });

    doc.status = 'approved';
    await doc.save();

    return res.json({ message: 'Đã duyệt tài liệu' });
  } catch (error) {
    console.error('approveDocument error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Controller từ chối (xoá) tài liệu
 */
exports.rejectDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const session = req.session;

    if (!session.admin) {
      return res.status(403).json({ message: 'Không có quyền' });
    }

    const doc = await Document.findById(id);
    if (!doc) return res.status(404).json({ message: 'Tài liệu không tồn tại' });

    await Document.deleteOne({ _id: id });
    return res.json({ message: 'Đã từ chối và xoá tài liệu' });
  } catch (error) {
    console.error('rejectDocument error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};
