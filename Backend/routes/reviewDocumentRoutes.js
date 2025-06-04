const express = require('express');
const router = express.Router();
const documentController = require('../controllers/reviewDocumentController');

router.get('/', documentController.getDocumentsForAdmin); // lấy document
router.get('/:id', documentController.getDocumentById);
router.put('/approve/:id', documentController.approveDocument); // duyệt document
router.delete('/:id', documentController.rejectDocument); // xóa document
module.exports = router;
