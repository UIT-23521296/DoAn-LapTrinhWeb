const express = require('express');
const router = express.Router();
const documentController = require('../controllers/reviewDocumentController');

router.get('/', documentController.getDocumentsForAdmin); // lấy document
router.put('/approve-document/:id', documentController.approveDocument); // duyệt document
router.delete('/reject-document/:id', documentController.rejectDocument); // xóa document
router.get('/:id', documentController.getDocumentById);
module.exports = router;
