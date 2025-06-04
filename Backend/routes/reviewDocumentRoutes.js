const express = require('express');
const router = express.Router();
const documentController = require('../controllers/reviewDocumentController');

router.get('/', documentController.getDocumentsForAdmin); // lấy document
<<<<<<< HEAD
router.put('/approve-document/:id', documentController.approveDocument); // duyệt document
router.delete('/reject-document/:id', documentController.rejectDocument); // xóa document
router.get('/:id', documentController.getDocumentById);
=======
router.put('/approve/:id', documentController.approveDocument); // duyệt document
router.delete('/:id', documentController.deleteDocument); // xóa document

>>>>>>> blog
module.exports = router;
