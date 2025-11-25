// src/controllers/contactController.js
import { Contact } from '../models/Contact.js';
import { validationResult } from 'express-validator';
import pool from '../config/database.js';

export const contactController = {
  async createMessage(req, res) {
    console.log('📨 Received contact form data:', req.body);
    
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log('❌ Validation errors:', errors.array());
        return res.status(400).json({
          success: false,
          message: 'Données invalides',
          errors: errors.array()
        });
      }

      const messageData = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone || null,
        company: req.body.company || null,
        subject: req.body.subject || null,
        message: req.body.message || null,
        message_type: req.body.message_type || 'general',
        needs: req.body.needs || null,
        file_path: req.body.file_path || null
      };

      console.log('💾 Saving to database:', messageData);

      const message = await Contact.create(messageData);
      
      console.log('✅ Message saved to DB with ID:', message.id);
      
      res.status(201).json({
        success: true,
        message: 'Message envoyé avec succès',
        data: message
      });
    } catch (error) {
      console.log('❌ Database error:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'envoi du message',
        error: error.message
      });
    }
  },

  async getMessages(req, res) {
    try {
      console.log('📋 Fetching all messages');
      const messages = await Contact.findAll();
      
      console.log(`✅ Found ${messages.length} messages`);
      
      res.json({
        success: true,
        data: messages
      });
    } catch (error) {
      console.log('❌ Error fetching messages:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des messages',
        error: error.message
      });
    }
  },

  async markAsRead(req, res) {
    try {
      console.log(`📖 Marking message ${req.params.id} as read`);
      
      const message = await Contact.markAsRead(req.params.id);
      
      if (!message) {
        console.log('❌ Message not found:', req.params.id);
        return res.status(404).json({
          success: false,
          message: 'Message non trouvé'
        });
      }
      
      console.log('✅ Message marked as read:', message.id);
      
      res.json({
        success: true,
        message: 'Message marqué comme lu',
        data: message
      });
    } catch (error) {
      console.log('❌ Error marking message as read:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la mise à jour du message',
        error: error.message
      });
    }
  },

  // 🔥 CORRECTION : Méthode updateStatus manquante
  async updateStatus(req, res) {
    try {
      const { status } = req.body;
      const messageId = req.params.id;
      
      console.log(`🔄 Updating message ${messageId} status to:`, status);

      // Valider le statut
      const validStatuses = ['new', 'read', 'replied'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Statut invalide. Valeurs autorisées: new, read, replied'
        });
      }

      const result = await pool.query(`
        UPDATE contact_messages 
        SET status = $1, updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING *
      `, [status, messageId]);

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Message non trouvé'
        });
      }

      console.log('✅ Message status updated:', result.rows[0]);
      
      res.json({
        success: true,
        message: `Statut mis à jour: ${status}`,
        data: result.rows[0]
      });
    } catch (error) {
      console.log('❌ Error updating message status:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la mise à jour du statut',
        error: error.message
      });
    }
  },

  // 🔥 CORRECTION : Méthode deleteMessage manquante
  async deleteMessage(req, res) {
    try {
      const messageId = req.params.id;
      console.log(`🗑️ Deleting message ${messageId}`);

      const result = await pool.query(`
        DELETE FROM contact_messages 
        WHERE id = $1
        RETURNING *
      `, [messageId]);

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Message non trouvé'
        });
      }

      console.log('✅ Message deleted:', result.rows[0]);
      
      res.json({
        success: true,
        message: 'Message supprimé avec succès',
        data: result.rows[0]
      });
    } catch (error) {
      console.log('❌ Error deleting message:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la suppression du message',
        error: error.message
      });
    }
  }
};