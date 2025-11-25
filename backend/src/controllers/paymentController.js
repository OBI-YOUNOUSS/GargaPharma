import stripe from '../config/stripe.js';
import { Order } from '../models/Order.js';

export const paymentController = {
  async createPaymentIntent(req, res) {
    try {
      const { orderId, amount, currency = 'xaf' } = req.body;
      
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convertir en centimes
        currency,
        metadata: {
          orderId: orderId.toString()
        },
      });

      res.json({
        success: true,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la création du paiement',
        error: error.message
      });
    }
  },

  async handlePaymentSuccess(req, res) {
    try {
      const { paymentIntentId, orderId } = req.body;
      
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status === 'succeeded') {
        // Mettre à jour le statut de la commande
        await Order.updateStatus(orderId, 'paid');
        
        res.json({
          success: true,
          message: 'Paiement confirmé avec succès'
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'Paiement non réussi'
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la confirmation du paiement',
        error: error.message
      });
    }
  }
};