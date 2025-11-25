import express from 'express';
import multer from 'multer';
import { catalogController } from '../controllers/catalogController.js';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.js';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/catalogs/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Seuls les fichiers PDF sont autorisés'), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

const router = express.Router();

// Routes publiques
router.get('/', catalogController.getCatalogs);
router.get('/:id', catalogController.getCatalogById);
router.get('/:id/download', catalogController.downloadCatalog);

// Routes admin
router.post('/', authMiddleware, adminMiddleware, upload.single('catalogFile'), catalogController.createCatalog);

export default router;