import { Router } from 'express';
import multer, { diskStorage } from 'multer';
import { getAllQueries, createQuery, updateQuery, viewPDF, exportToCSV } from '../controllers/queryController.js';

const router = Router();
const storage = diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });


router.get('/', getAllQueries);
router.post('/add', createQuery);
router.post('/update/:id', upload.array('pdfFiles'), updateQuery);
router.get('/pdf/:filename', viewPDF);
router.get('/export', exportToCSV);

export default router;
