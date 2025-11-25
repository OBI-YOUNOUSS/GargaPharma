// src/models/Notification.js
import pool from '../config/database.js';

export const Notification = {
  async create(notificationData) {
    const { user_id, order_id, conversation_id, type, title, message } = notificationData;
    
    const result = await pool.query(`
      INSERT INTO notifications (user_id, order_id, conversation_id, type, title, message)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [user_id, order_id, conversation_id, type, title, message]);
    
    return result.rows[0];
  },

  async findByUserId(userId) {
    const result = await pool.query(`
      SELECT * FROM notifications 
      WHERE user_id = $1 
      ORDER BY created_at DESC
      LIMIT 50
    `, [userId]);
    
    return result.rows;
  },

  async markAsRead(notificationId) {
    const result = await pool.query(`
      UPDATE notifications 
      SET is_read = true 
      WHERE id = $1
      RETURNING *
    `, [notificationId]);
    
    return result.rows[0];
  },

  async markAllAsRead(userId) {
    const result = await pool.query(`
      UPDATE notifications 
      SET is_read = true 
      WHERE user_id = $1 AND is_read = false
      RETURNING COUNT(*) as updated_count
    `, [userId]);
    
    return parseInt(result.rows[0].updated_count);
  },

  async getUnreadCount(userId) {
    const result = await pool.query(`
      SELECT COUNT(*) as unread_count
      FROM notifications 
      WHERE user_id = $1 AND is_read = false
    `, [userId]);
    
    return parseInt(result.rows[0].unread_count);
  }
};