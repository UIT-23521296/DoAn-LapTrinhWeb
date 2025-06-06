// models/Notification.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // người nhận
  message: { type: String, required: true }, // nội dung thông báo
  read: { type: Boolean, default: false }, // trạng thái đã đọc hay chưa
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);
