const Document = require('../models/Document');

exports.getDocumentsForAdmin = async (req, res) => {
  try {
    const approvedDocuments = await Document.find({ status: 'approved' }).sort({ uploadDate: -1 }).lean();
    const pendingDocuments = await Document.find({ status: { $in: ['pending', 'rejected'] } }).sort({ uploadDate: -1 }).lean();

    // Thêm field chung để frontend nhận dạng
    const mapDoc = doc => ({
      ...doc,
      type: 'document',
      approved: doc.status === 'approved',
      createdAt: doc.uploadDate,
      author: doc.uploader,
      subject: doc.subjectName
    });

    res.json({
      approvedDocuments: approvedDocuments.map(mapDoc),
      pendingDocuments: pendingDocuments.map(mapDoc)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Lỗi khi lấy tài liệu' });
  }
};

exports.approveDocument = async (req, res) => {
  try {
    const id = req.params.id;
    const doc = await Document.findById(id);
    if (!doc) return res.status(404).json({ msg: 'Tài liệu không tồn tại' });
    if (doc.status === 'approved') return res.status(400).json({ msg: 'Tài liệu đã được duyệt' });

    doc.status = 'approved';
    await doc.save();

    res.json({ msg: 'Duyệt tài liệu thành công', document: doc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Lỗi khi duyệt tài liệu' });
  }
};

exports.deleteDocument = async (req, res) => {
  try {
    const id = req.params.id;
    const doc = await Document.findByIdAndDelete(id);
    if (!doc) return res.status(404).json({ msg: 'Tài liệu không tồn tại' });
    res.json({ msg: 'Xóa tài liệu thành công' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Lỗi khi xóa tài liệu' });
  }
};
