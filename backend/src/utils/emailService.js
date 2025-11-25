// utils/emailService.js - VERSION COMPLÈTE FONCTIONNELLE
// utils/emailService.js - VERSION DEBUG
import nodemailer from 'nodemailer';

const createTransporter = () => {
  console.log('🔧 Configuration email:', {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS ? '***' + process.env.EMAIL_PASS.slice(-3) : 'NON DÉFINI'
  });

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('❌ VARIABLES EMAIL MANQUANTES dans .env');
    return null;
  }

  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

export const emailService = {
  async sendOrderConfirmation(order, customerEmail) {
    try {
      console.log('📧 === DÉBUT ENVOI EMAIL ===');
      console.log('📨 À:', customerEmail);
      console.log('🆔 Commande:', order.id);
      
      if (!customerEmail) {
        console.error('❌ EMAIL CLIENT MANQUANT');
        return false;
      }

      const transporter = createTransporter();
      if (!transporter) {
        console.error('❌ TRANSPORTER NON CRÉÉ');
        return false;
      }

      // 🔍 TEST CONNEXION SMTP
      try {
        await transporter.verify();
        console.log('✅ Serveur SMTP prêt');
      } catch (smtpError) {
        console.error('❌ ERREUR CONNEXION SMTP:', smtpError);
        return false;
      }

      const mailOptions = {
        from: `"GARGAPharma" <${process.env.EMAIL_USER}>`,
        to: customerEmail,
        subject: `Confirmation commande #${order.id} - GARGAPharma`,
        html: this.generateOrderConfirmationHTML(order)
      };

      console.log('📤 Envoi en cours...');
      const result = await transporter.sendMail(mailOptions);
      
      console.log('✅ EMAIL ENVOYÉ AVEC SUCCÈS');
      console.log('📨 Message ID:', result.messageId);
      console.log('✅ === FIN ENVOI EMAIL ===');
      
      return true;
      
    } catch (error) {
      console.error('💥 ERREUR CRITIQUE EMAIL:', error);
      return false;
    }
  },

  async sendOrderStatusUpdate(order, customerEmail) {
    try {
      console.log(`📧 Mise à jour statut commande #${order.id} pour:`, customerEmail);
      
      if (!customerEmail) {
        console.error('❌ Email client manquant pour commande:', order.id);
        return false;
      }

      const transporter = createTransporter();
      
      const statusMessages = {
        'pending': 'en attente',
        'processing': 'en cours de traitement',
        'shipped': 'expédiée',
        'delivered': 'livrée',
        'cancelled': 'annulée',
        'paid': 'payée'
      };

      const mailOptions = {
        from: `"GARGAPharma" <${process.env.EMAIL_USER}>`,
        to: customerEmail,
        subject: `Mise à jour de votre commande #${order.id} - GARGAPharma`,
        html: this.generateStatusUpdateHTML(order, statusMessages)
      };

      const result = await transporter.sendMail(mailOptions);
      console.log(`✅ Email statut "${order.status}" envoyé. ID:`, result.messageId);
      return true;
      
    } catch (error) {
      console.error('💥 Erreur envoi email statut:', error);
      return false;
    }
  },

  generateOrderConfirmationHTML(order) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { 
            font-family: Arial, sans-serif; 
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header { 
            background: #2563eb; 
            color: white; 
            padding: 30px; 
            text-align: center; 
            border-radius: 10px 10px 0 0;
          }
          .content { 
            padding: 30px; 
            background: #f8fafc;
            border: 1px solid #e2e8f0;
          }
          .footer { 
            background: #1e293b; 
            color: white; 
            padding: 20px; 
            text-align: center;
            border-radius: 0 0 10px 10px;
          }
          .order-details {
            background: white;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .button {
            display: inline-block;
            background: #2563eb;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 5px;
            margin: 10px 0;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>GARGAPharma</h1>
          <h2>Confirmation de commande #${order.id}</h2>
        </div>
        
        <div class="content">
          <p>Bonjour,</p>
          <p>Votre commande a été créée avec succès et est en cours de traitement.</p>
          
          <div class="order-details">
            <h3>Détails de la commande</h3>
            <p><strong>Numéro de commande:</strong> #${order.id}</p>
            <p><strong>Montant total:</strong> ${order.total_amount} FCFA</p>
            <p><strong>Date:</strong> ${new Date(order.created_at).toLocaleDateString('fr-FR')}</p>
            <p><strong>Statut:</strong> En attente de traitement</p>
          </div>
          
          <p>Nous vous tiendrons informé de l'évolution de votre commande par email.</p>
          <p>Pour toute question, n'hésitez pas à nous contacter.</p>
          
          <a href="http://localhost:5173/mes-commandes" class="button">Voir mes commandes</a>
        </div>
        
        <div class="footer">
          <p>Merci pour votre confiance !</p>
          <p><strong>GARGAPharma</strong></p>
          <p>Email: contact@gargapharma.td | Tél: +235 XX XX XX XX</p>
        </div>
      </body>
      </html>
    `;
  },

  generateStatusUpdateHTML(order, statusMessages) {
    const statusText = statusMessages[order.status] || order.status;
    const statusIcons = {
      'pending': '⏳',
      'processing': '🔄',
      'shipped': '🚚',
      'delivered': '✅',
      'cancelled': '❌',
      'paid': '💰'
    };

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { 
            font-family: Arial, sans-serif; 
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header { 
            background: #059669; 
            color: white; 
            padding: 30px; 
            text-align: center; 
            border-radius: 10px 10px 0 0;
          }
          .content { 
            padding: 30px; 
            background: #f8fafc;
            border: 1px solid #e2e8f0;
          }
          .status-badge {
            background: #dcfce7;
            color: #166534;
            padding: 10px 20px;
            border-radius: 20px;
            display: inline-block;
            font-weight: bold;
            margin: 10px 0;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Mise à jour de commande</h1>
        </div>
        
        <div class="content">
          <p>Bonjour,</p>
          <p>Le statut de votre commande a été mis à jour :</p>
          
          <div class="status-badge">
            ${statusIcons[order.status] || '📦'} Statut: ${statusText}
          </div>
          
          <p><strong>Commande #${order.id}</strong></p>
          <p>Montant: ${order.total_amount} FCFA</p>
          
          <p>Vous pouvez suivre l'évolution de votre commande dans votre espace client.</p>
          
          <a href="http://localhost:5173/mes-commandes" style="display: inline-block; background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0;">
            Voir ma commande
          </a>
        </div>
        
        <div style="background: #1e293b; color: white; padding: 20px; text-align: center; border-radius: 0 0 10px 10px;">
          <p>GARGAPharma - Votre partenaire santé</p>
        </div>
      </body>
      </html>
    `;
  }
};