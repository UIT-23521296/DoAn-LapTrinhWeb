const fs = require('fs');
const path = require('path');
const Document = require('../models/Document');
const data = require('../data.json'); // chứa slug và label

function getLabelsFromSlug(subjectTypeSlug, subjectNameSlug) {
  const subjectType = data[subjectTypeSlug];
  if (!subjectType || !subjectType.subjects) return null;

  const subject = subjectType.subjects.find(s => s.slug === subjectNameSlug);
  if (!subject) return null;

  return {
    subjectTypeLabel: subjectType.label, // "Môn Tự Chọn"
    subjectNameLabel: subject.label      // "Ngoại ngữ"
  };
}

exports.uploadDocument = async (req, res) => {
  try {
    const uploader = req.session.user?.username ?? req.session.admin?.username;
    const { title, subjectTypeSlug, subjectNameSlug, documentType } = req.body;

    console.log('[Upload] Received:', { title, subjectTypeSlug, subjectNameSlug, documentType });

    if (!req.file) {
      return res.status(400).json({ error: 'Chưa upload file.' });
    }

    if (!title || !subjectTypeSlug || !subjectNameSlug || !documentType) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'Thiếu thông tin bắt buộc.' });
    }

    const labels = getLabelsFromSlug(subjectTypeSlug, subjectNameSlug);

    if (!labels) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'Slug không hợp lệ hoặc không tồn tại trong data.json.' });
    }

    const newDoc = new Document({
      title,
      fileUrl: req.file.path,
      subjectTypeSlug,
      subjectTypeLabel: labels.subjectTypeLabel,
      subjectNameSlug,
      subjectNameLabel: labels.subjectNameLabel,
      documentType,
      uploader,
      status: 'pending'
    });

    await newDoc.save();

    return res.status(201).json({
      message: 'Upload tài liệu thành công.',
      document: newDoc
    });
  } catch (error) {
    console.error('Lỗi uploadDocument:', error);

    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    return res.status(500).json({ error: 'Lỗi server.' });
  }
};
