const express = require("express");
const router = express.Router();
const upload = require("../config/multerConfig");
const Document = require("../models/Document");

router.post("/", upload.single("file"), async (req, res) => {
  try {
    const { title, description, uploader, subject, year } = req.body;

    // Kiểm tra có file upload không
    if (!req.file) {
      return res.status(400).json({ error: "Chưa upload file" });
    }

    // Kiểm tra các trường bắt buộc
    if (!title || !subject || !year || !uploader) {
      return res.status(400).json({ error: "Thiếu thông tin bắt buộc" });
    }

    const newDoc = new Document({
      title,
      description,
      subject,
      year,
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
