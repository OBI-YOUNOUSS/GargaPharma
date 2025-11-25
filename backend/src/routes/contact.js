// src/routes/contact.js
import express from 'express';
import { contactController } from '../controllers/contactController.js';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.js';
import { validateContact } from '../middleware/validationMiddleware.js';

const router = express.Router();

// Route publique pour envoyer des messages
router.post('/', validateContact, contactController.createMessage);

// Routes admin pour gérer les messages
router.get('/', authMiddleware, adminMiddleware, contactController.getMessages);
router.get('/messages', authMiddleware, adminMiddleware, contactController.getMessages); // Alias

// Routes pour mettre à jour les messages
router.patch('/:id/read', authMiddleware, adminMiddleware, contactController.markAsRead);
router.patch('/:id/status', authMiddleware, adminMiddleware, contactController.updateStatus);
router.delete('/:id', authMiddleware, adminMiddleware, contactController.deleteMessage);

export default router;