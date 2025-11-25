import { Order } from '../models/Order.js';
import { emailService } from '../utils/emailService.js';
import { Notification } from '../models/Notification.js';
import { validationResult } from 'express-validator';

export const orderController = {
  async createOrder(req, res) {
    try {
      console.log('=== 🚨 DEBUG COMMANDE DÉBUT ===');
      console.log('🔐 Headers Authorization:', req.headers.authorization);
      console.log('👤 User object:', req.user);
      console.log('📦 Body reçu:', req.body);
      
      if (!req.user) {
        console.log('❌ ERREUR: req.user est undefined');
        return res.status(401).json({
          success: false,
          message: 'Utilisateur non authentifié'
        });
      }
      
      if (!req.user.id) {
        console.log('❌ ERREUR: req.user.id est undefined');
        return res.status(401).json({
          success: false,
          message: 'ID utilisateur manquant'
        });
      }
      
      console.log('✅ User ID trouvé:', req.user.id);

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log('❌ Erreurs de validation:', errors.array());
        return res.status(400).json({
          success: false,
          message: 'Données invalides',
          errors: errors.array()
        });
      }
      
      const orderData = {
        ...req.body,
        user_id: req.user.id
      };
      
      console.log('📦 OrderData final:', orderData);
      console.log('=== 🚨 DEBUG COMMANDE FIN ===');
      
      const order = await Order.create(orderData);
      
      // 🔔 SYSTÈME DE NOTIFICATIONS ET EMAILS
      try {
        // Créer la notification pour l'utilisateur
        await Notification.create({
          user_id: req.user.id,
          order_id: order.id,
          type: 'order_created',
          title: 'Commande confirmée ✅',
          message: `Votre commande #${order.id} a été créée avec succès. Montant: ${order.total_amount} FCFA. Nous vous tiendrons informé de son évolution.`
        });

        console.log('✅ Notification créée pour la commande:', order.id);

        // Envoyer l'email de confirmation
        const emailSent = await emailService.sendOrderConfirmation(order, orderData.customer_email);
        
        if (emailSent) {
          console.log('✅ Email de confirmation envoyé à:', orderData.customer_email);
        } else {
          console.log('⚠️ Email non envoyé (problème de configuration)');
        }
        
      } catch (notificationError) {
        console.error('⚠️ Erreur lors de la création de la notification/email:', notificationError);
        // Ne pas bloquer la commande si les notifications échouent
      }
      
      res.status(201).json({
        success: true,
        message: 'Commande créée avec succès',
        data: order
      });
    } catch (error) {
      console.error('💥 ERREUR création commande:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la création de la commande',
        error: error.message
      });
    }
  },

  async getUserOrders(req, res) {
    try {
      const orders = await Order.findByUserId(req.user.id);
      
      res.json({
        success: true,
        data: orders
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des commandes',
        error: error.message
      });
    }
  },

  async getAllOrders(req, res) {
    try {
      console.log('📦 Récupération de toutes les commandes (admin)');
      
      // Utiliser la méthode corrigée
      const orders = await Order.findAll();
      
      console.log(`✅ ${orders.length} commandes récupérées`);
      
      // 🔥 DEBUG: Afficher la structure des données
      if (orders.length > 0) {
        console.log('📊 Structure première commande:', {
          id: orders[0].id,
          user_name: orders[0].user_name,
          user_email: orders[0].user_email,
          items_count: orders[0].items ? orders[0].items.length : 0
        });
      }
      
      res.json({
        success: true,
        data: orders
      });
    } catch (error) {
      console.error('💥 Erreur récupération commandes:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des commandes',
        error: error.message
      });
    }
  },

  // 🔥 AJOUT: Méthode pour obtenir les détails d'une commande
  async getOrderById(req, res) {
    try {
      const order = await Order.findById(req.params.id);
      
      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Commande non trouvée'
        });
      }
      
      res.json({
        success: true,
        data: order
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération de la commande',
        error: error.message
      });
    }
  },

  async updateOrderStatus(req, res) {
    try {
      const { status } = req.body;
      
      console.log(`🔄 Mise à jour statut commande ${req.params.id} vers:`, status);
      
      const order = await Order.updateStatus(req.params.id, status);
      
      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Commande non trouvée'
        });
      }

      // 🔔 NOTIFICATION + EMAIL pour TOUS les changements de statut
      if (order.user_id) {
        try {
          const statusMessages = {
            'pending': 'en attente',
              'confirmed': '✅',
            'processing': 'en cours de traitement',
            'shipped': 'expédiée', 
            'delivered': 'livrée',
            'cancelled': 'annulée',
            'paid': 'payée'
          };

          const statusIcons = {
            'pending': '⏳',
            'confirmed': '✅',
            'processing': '🔄',
            'shipped': '🚚',
            'delivered': '✅',
            'cancelled': '❌',
            'paid': '💰'
          };

          // 1. Créer notification pour l'utilisateur
          await Notification.create({
            user_id: order.user_id,
            order_id: order.id,
            type: 'order_updated',
            title: `Statut commande mis à jour ${statusIcons[status] || '📦'}`,
            message: `Votre commande #${order.id} est maintenant "${statusMessages[status] || status}"`
          });

          console.log(`✅ Notification statut "${status}" créée pour commande:`, order.id);

          // 2. ENVOYER EMAIL POUR TOUS LES STATUTS
          let customerEmail = order.customer_email;
          
          // Si customer_email n'est pas dans l'objet order, récupérer depuis la base
          if (!customerEmail) {
            const fullOrder = await Order.findById(order.id);
            customerEmail = fullOrder.customer_email;
          }
          
          if (customerEmail) {
            console.log(`📧 Envoi email statut "${status}" à:`, customerEmail);
            
            // Préparer les données pour l'email
            const emailData = {
              ...order,
              status: status,
              customer_name: order.customer_name,
              customer_email: customerEmail
            };
            
            const emailSent = await emailService.sendOrderStatusUpdate(emailData, customerEmail);
            
            if (emailSent) {
              console.log(`✅ Email statut "${status}" envoyé avec succès à:`, customerEmail);
            } else {
              console.log(`⚠️ Échec envoi email statut "${status}" à:`, customerEmail);
            }
          } else {
            console.log(`❌ Email client non trouvé pour commande:`, order.id);
          }
          
        } catch (notifError) {
          console.error('⚠️ Erreur lors de la création notification/email statut:', notifError);
          // Continuer même si les notifications échouent
        }
      } else {
        console.log('⚠️ Aucun user_id trouvé pour la commande:', order.id);
      }
      
      res.json({
        success: true,
        message: 'Statut de commande mis à jour',
        data: order
      });
    } catch (error) {
      console.error('💥 Erreur lors de la mise à jour du statut:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la mise à jour du statut',
        error: error.message
      });
    }
  }
};