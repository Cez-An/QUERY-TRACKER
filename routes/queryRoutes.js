import { Router } from 'express';
import multer, { diskStorage } from 'multer';
import { searchQueries,renderHome, createQuery, viewPDF, exportToCSV,uploadPDF} from '../controllers/queryController.js'; // updateQuery

const router = Router();
const storage = diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

router.get('/', renderHome);
router.get('/search', searchQueries);
router.post('/add', createQuery);

router.post('/upload-pdf/:id', upload.single('pdfFile'),uploadPDF);
router.get('/pdf/:filename', viewPDF);
router.get('/export', exportToCSV);

export default router;
