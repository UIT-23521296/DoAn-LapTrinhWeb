const express = require('express');
const router  = express.Router();
const upload  = require('../config/multerConfig');
const auth    = require('../middleware/authMiddleware');
const ctrl    = require('../controllers/documentController');

router.post(
  '/upload',
  auth,
  upload.single('file'),
  ctrl.uploadDocument    // gọi đến controller đã lấy đúng username
);

module.exports = router;