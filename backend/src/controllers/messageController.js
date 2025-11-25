// src/controllers/messageController.js
import { Message } from '../models/Message.js';
import { Conversation } from '../models/Conversation.js';
import { Notification } from '../models/Notification.js';

export const messageController = {
  // Envoyer un message
  async sendMessage(req, res) {
    try {
      const { conversation_id, content, message_type = 'text' } = req.body;
      
      // Vérifier que la conversation existe et que l'utilisateur y a accès
      const conversation = await Conversation.findById(conversation_id);
      
      if (!conversation) {
        return res.status(404).json({
          success: false,
          message: 'Conversation non trouvée'
        });
      }
      
      const message = await Message.create({
        conversation_id,
        sender_id: req.user.id,
        content,
        message_type
      });
      
      // Notifier l'autre participant
      const recipientId = req.user.role === 'admin' ? conversation.user_id : conversation.admin_id;
      
      if (recipientId) {
        await Notification.create({
          user_id: recipientId,
          conversation_id: conversation.id,
          type: 'new_message',
          title: 'Nouveau message',
          message: `Vous avez reçu un nouveau message dans la conversation: "${conversation.subject}"`
        });
      }
      
      res.status(201).json({
        success: true,
        message: 'Message envoyé avec succès',
        data: message
      });
    } catch (error) {
      console.error('Erreur envoi message:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'envoi du message',
        error: error.message
      });
    }
  },

  // Marquer les messages comme lus
  async markAsRead(req, res) {
    try {
      const { message_ids } = req.body;
      
      for (const messageId of message_ids) {
        await Message.markAsRead(messageId, req.user.id);
      }
      
      res.json({
        success: true,
        message: 'Messages marqués comme lus'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la mise à jour des messages',
        error: error.message
      });
    }
  },

  // Obtenir le nombre de messages non lus
  async getUnreadCount(req, res) {
    try {
      const unreadCount = await Message.getUnreadCount(req.user.id);
      
      res.json({
        success: true,
        data: { unread_count: unreadCount }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors du comptage des messages non lus',
        error: error.message
      });
    }
  }
};