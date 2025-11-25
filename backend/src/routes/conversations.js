// routes/conversations.js - AJOUTER CES ROUTES
import express from 'express';
import { conversationController } from '../controllers/conversationController.js';
import { messageController } from '../controllers/messageController.js';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Routes conversations
router.post('/', authMiddleware, conversationController.createConversation);
router.get('/my-conversations', authMiddleware, conversationController.getUserConversations);
router.get('/', authMiddleware, adminMiddleware, conversationController.getAllConversations);
router.get('/:id', authMiddleware, conversationController.getConversation);

// 🔥 AJOUT: Route pour admin pour répondre aux messages
router.post('/:id/messages', authMiddleware, messageController.sendMessage);
router.patch('/messages/read', authMiddleware, messageController.markAsRead);
router.get('/messages/unread-count', authMiddleware, messageController.getUnreadCount);

// 🔥 NOUVELLE ROUTE: Marquer une conversation comme lue (pour admin)
router.patch('/:id/mark-read', authMiddleware, async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation non trouvée'
      });
    }

    // Marquer comme lue par l'admin
    await Conversation.updateLastRead(req.user.id, req.params.id);
    
    res.json({
      success: true,
      message: 'Conversation marquée comme lue'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour',
      error: error.message
    });
  }
});

export default router;