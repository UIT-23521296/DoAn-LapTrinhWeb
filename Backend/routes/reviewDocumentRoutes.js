const express = require('express');
const router = express.Router();
const documentController = require('../controllers/reviewDocumentController');

router.get('/', documentController.getDocumentsForAdmin); // lấy document
router.put('/approve/:id', documentController.approveDocument); // duyệt document
router.delete('/:id', documentController.deleteDocument); // xóa document

module.exports = router;
