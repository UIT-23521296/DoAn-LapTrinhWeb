const fs = require('fs');
const multer = require('multer');
const upload = multer({ dest: 'uploads/Img/' }); // lưu tạm trước khi đẩy lên Drive

const { uploadFileToDrive } = require('./uploads/googleDrive');

app.post('/api/blogs', upload.single('thumbnail'), async (req, res) => {
  try {
    const { title, content } = req.body;
    const thumbnail = req.file;

    let imageUrl = '';
    if (thumbnail) {
      imageUrl = await uploadFileToDrive(thumbnail.path, thumbnail.originalname, '185Efbd-izYwsA4r41TXgVMu_rGoWDXf9');
      // Xoá file tạm
      fs.unlinkSync(thumbnail.path);
    }

    const newBlog = new Blog({
      title,
      thumbnailImage: imageUrl,
      approved: false,
    });

    await newBlog.save();
    // ... lưu content cũng như bạn đã làm
    res.json({ msg: 'Đăng blog thành công', blog: newBlog });
  } catch (err) {
    console.error('Upload blog error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});
