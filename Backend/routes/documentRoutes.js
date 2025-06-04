const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');

// [GET] /api/documents/by-subject/:subjectTypeSlug/:subjectNameSlug
router.get(
  '/by-subject/:subjectTypeSlug/:subjectNameSlug',
  documentController.getDocumentsBySubject
);

module.exports = router;
