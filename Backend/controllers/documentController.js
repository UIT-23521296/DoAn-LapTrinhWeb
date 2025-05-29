const Document = require('../models/Document');

exports.getPendingDocuments = async (req, res) => {
  try {
    const pendingDocs = await Document.find({ status: 'pending' }).sort({ uploadDate: -1 });
    res.json(pendingDocs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
