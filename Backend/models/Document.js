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
    subject: {
    type: String,
    required: true
    },
    year: {
    type: String,
    required: true
    },

    rejectionReason: String
    });

    module.exports = mongoose.model('Document', documentSchema);
