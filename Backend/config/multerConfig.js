const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const filetypes = /pdf|doc|docx|ppt|pptx/;
const allowedMimeTypes = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation'
];

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedMimeTypes.includes(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Chỉ chấp nhận file PDF, DOC, DOCX, PPT, PPTX'));
    }
  }
});

module.exports = upload;
