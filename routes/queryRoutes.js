const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const queryController = require('../controllers/queryController');

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Routes
router.get('/', queryController.getAllQueries);
router.post('/add', upload.array('pdfFiles'), queryController.createQuery);
router.post('/update/:id', upload.array('pdfFiles'), queryController.updateQuery);
router.get('/pdf/:filename', queryController.viewPDF);
router.get('/export', queryController.exportToCSV);

module.exports = router;
