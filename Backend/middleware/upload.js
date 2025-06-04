// /project-root/middlewares/upload.js

const multer = require('multer');
const path = require('path');

// Cấu hình storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Định nghĩa loại file được phép (PDF, DOC, DOCX, PPT, PPTX)
const filetypes = /pdf|doc|docx/;
const allowedMimeTypes = [
  'application/pdf',
  'application/msword', // .doc
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document' // .docx
];


const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
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
