// routes/notifications.js
const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const authMiddleware = require('../middleware/authMiddleware');

const mongoose = require('mongoose');

router.get('/', authMiddleware, async (req, res) => {
  try {
    const notifs = await Notification.find({ user: req.user.id })

      .sort({ createdAt: -1 })
      .limit(10);

    res.json(notifs);
  } catch (err) {
    console.error('Lỗi khi lấy thông báo:', err);
    res.status(500).json({ msg: 'Lỗi khi lấy thông báo' });
  }
});


module.exports = router;
