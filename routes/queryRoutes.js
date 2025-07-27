import { Router } from 'express';
const router = Router();
import multer, { diskStorage } from 'multer';
import path from 'path';
import { getAllQueries, createQuery, updateQuery, viewPDF, exportToCSV } from '../controllers/queryController.js';

// Multer config
const storage = diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Routes
router.get('/', getAllQueries);
router.post('/add', upload.array('pdfFiles'), createQuery);
router.post('/update/:id', upload.array('pdfFiles'), updateQuery);
router.get('/pdf/:filename', viewPDF);
router.get('/export', exportToCSV);

export default router;
