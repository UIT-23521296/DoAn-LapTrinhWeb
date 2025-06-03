const Document = require('../models/Document');
const data = require('../data.json');

// Trả lại cả label (hiển thị cho client), không dùng để query
function getLabelsFromSlug(subjectTypeSlug, subjectNameSlug) {
  const subjectType = data[subjectTypeSlug];
  if (!subjectType || !subjectType.subjects) return null;

  const subject = subjectType.subjects.find(s => s.slug === subjectNameSlug);
  if (!subject) return null;

  return {
    subjectTypeLabel: subjectType.label,
    subjectNameLabel: subject.label
  };
}

exports.getDocumentsBySubject = async (req, res) => {
  const { subjectTypeSlug, subjectNameSlug } = req.params;

  console.log('[API] Nhận request:', subjectTypeSlug, subjectNameSlug);

  const labels = getLabelsFromSlug(subjectTypeSlug, subjectNameSlug);
  if (!labels) {
    return res.status(400).json({ message: 'Slug không hợp lệ.' });
  }

  // ❗ Query theo slug (đã lưu trong MongoDB)
  const query = {
    subjectTypeSlug,
    subjectNameSlug,
    status: 'pending'
  };

  console.log('[MongoDB Query]', query);

  try {
    const documents = await Document.find(query).select('title fileUrl').lean();

    if (!documents || documents.length === 0) {
      // Trả về mảng rỗng thay vì lỗi 404
      return res.status(200).json({
        subjectType: labels.subjectTypeLabel,
        subjectName: labels.subjectNameLabel,
        documents: [],
        message: 'Chưa có tài liệu phù hợp.'
      });
    }

    res.status(200).json({
      subjectType: labels.subjectTypeLabel,
      subjectName: labels.subjectNameLabel,
      documents
    });
  } catch (error) {
    console.error('[Lỗi truy vấn MongoDB]', error);
    res.status(500).json({ message: 'Lỗi server.' });
  }
};

