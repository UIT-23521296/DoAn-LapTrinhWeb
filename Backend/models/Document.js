const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  fileUrl: {
    type: String,
    required: true
  },
  uploader: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  rejectionReason: String
});

module.exports = mongoose.model('Document', documentSchema);
