// src/controllers/conversationController.js
import { Conversation } from '../models/Conversation.js';
import { Message } from '../models/Message.js';
import { Notification } from '../models/Notification.js';
import pool from '../config/database.js';

export const conversationController = {
  // Créer une nouvelle conversation
  async createConversation(req, res) {
    try {
      const { subject, order_id } = req.body;
      
      // Trouver un admin pour assigner la conversation
      const adminResult = await pool.query(
        'SELECT id FROM users WHERE role = $1 LIMIT 1',
        ['admin']
      );
      
      const adminId = adminResult.rows[0]?.id || null;
      
      const conversation = await Conversation.create({
        user_id: req.user.id,
        admin_id: adminId,
        subject,
        order_id: order_id || null
      });
      
      res.status(201).json({
        success: true,
        message: 'Conversation créée avec succès',
        data: conversation
      });
    } catch (error) {
      console.error('Erreur création conversation:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la création de la conversation',
        error: error.message
      });
    }
  },

  // Obtenir les conversations de l'utilisateur
  async getUserConversations(req, res) {
    try {
      const conversations = await Conversation.findByUserId(req.user.id);
      
      res.json({
        success: true,
        data: conversations
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des conversations',
        error: error.message
      });
    }
  },

  // Obtenir toutes les conversations (admin)
  async getAllConversations(req, res) {
    try {
      const conversations = await Conversation.findAll();
      
      res.json({
        success: true,
        data: conversations
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des conversations',
        error: error.message
      });
    }
  },

  // Obtenir les détails d'une conversation
  async getConversation(req, res) {
    try {
      const conversation = await Conversation.findById(req.params.id);
      
      if (!conversation) {
        return res.status(404).json({
          success: false,
          message: 'Conversation non trouvée'
        });
      }
      
      // Vérifier les permissions
      if (req.user.role !== 'admin' && conversation.user_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Accès non autorisé à cette conversation'
        });
      }
      
      const messages = await Message.findByConversationId(req.params.id);
      
      res.json({
        success: true,
        data: {
          conversation,
          messages
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération de la conversation',
        error: error.message
      });
    }
  }
};