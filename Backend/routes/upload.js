const express = require("express");
const router = express.Router();
const upload = require("../config/multerConfig");
const Document = require("../models/Document");
const authMiddleware = require('../middleware/authMiddleware.js');  // import middleware

router.post("/upload", authMiddleware, upload.single("file"), async (req, res) => {
  try {
    console.log('Session user:', req.session.user); // << kiểm tra user có không

    const { title, subjectType, subjectName, documentType, description } = req.body;

    if (!req.file) return res.status(400).json({ error: "Chưa upload file" });
    if (!title || !subjectType || !subjectName || !documentType)
      return res.status(400).json({ error: "Thiếu thông tin bắt buộc" });

    const uploader = "test_user";

    const newDoc = new Document({
      title,
      description,
      subjectType,
      subjectName,
      documentType,
      uploader,
      fileUrl: req.file.path,
      status: "pending"
    });

    await newDoc.save();
    res.status(201).json({ message: "Upload thành công", document: newDoc });

  } catch (err) {
    console.error("Lỗi khi upload:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
