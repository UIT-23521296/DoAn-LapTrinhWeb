const express = require("express");
const multer = require("multer");
const router = express.Router();
const upload = require("../config/multerConfig");
const Document = require("../models/Document");

router.post("/", upload.single("file"), async (req, res) => {
  try {
    const { title, description, uploader } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "Chưa upload file" });
    }

    const newDoc = new Document({
      title,
      description,
      uploader: uploader || "Unknown",
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
