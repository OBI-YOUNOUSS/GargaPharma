import express from 'express';
import { productController } from '../controllers/productController.js';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.js';
import { uploadProductImage } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Debug middleware pour la route POST
router.post('/', authMiddleware, adminMiddleware, uploadProductImage.single('image'), (req, res, next) => {
  console.log('=== 🚨 DEBUG ROUTE PRODUCT POST ===');
  console.log('🔐 User:', req.user);
  console.log('📝 Body:', req.body);
  console.log('🖼️ File:', req.file);
  console.log('=== FIN DEBUG ROUTE ===');
  next();
}, productController.createProduct);

// Les autres routes restent inchangées
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);
router.put('/:id', authMiddleware, adminMiddleware, uploadProductImage.single('image'), productController.updateProduct);
router.delete('/:id', authMiddleware, adminMiddleware, productController.deleteProduct);

export default router;