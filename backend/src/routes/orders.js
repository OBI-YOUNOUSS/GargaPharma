import express from 'express';
import { orderController } from '../controllers/orderController.js';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.js';
import { validateOrder } from '../middleware/validationMiddleware.js';

const router = express.Router();

// Routes protégées
router.post('/', authMiddleware, validateOrder, orderController.createOrder);
router.get('/my-orders', authMiddleware, orderController.getUserOrders);

// Routes admin
router.get('/', authMiddleware, adminMiddleware, orderController.getAllOrders);
router.patch('/:id/status', authMiddleware, adminMiddleware, orderController.updateOrderStatus);

// 🔥 AJOUT: Route pour obtenir les détails d'une commande
router.get('/:id', authMiddleware, adminMiddleware, orderController.getOrderById);

export default router;