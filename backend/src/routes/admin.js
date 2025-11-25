import express from 'express';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.js';
import { User } from '../models/User.js';
import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import pool from '../config/database.js';

const router = express.Router();

router.get('/stats', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalOrders = await Order.count(); 
    const totalProducts = await Product.count();
    const totalRevenue = await Order.sum('total_amount');
    
    // Statistiques supplémentaires
    const recentOrders = await pool.query(`
      SELECT COUNT(*) as pending_orders 
      FROM orders 
      WHERE status = 'pending'
    `);
    
    const lowStockProducts = await Product.getLowStock(5);
    
    res.json({
      success: true,
      data: { 
        totalUsers, 
        totalOrders, 
        totalProducts, 
        totalRevenue,
        pendingOrders: parseInt(recentOrders.rows[0].pending_orders),
        lowStockCount: lowStockProducts.length
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la récupération des statistiques',
      error: error.message 
    });
  }
});

// Route pour obtenir tous les utilisateurs
router.get('/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, email, name, role, company, phone, created_at 
      FROM users 
      ORDER BY created_at DESC
    `);
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des utilisateurs',
      error: error.message
    });
  }
});

export default router;