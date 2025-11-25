// src/models/Conversation.js
import pool from '../config/database.js';

export const Conversation = {
  async create(conversationData) {
    const { user_id, admin_id, subject, order_id } = conversationData;
    
    const result = await pool.query(`
      INSERT INTO conversations (user_id, admin_id, subject, order_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [user_id, admin_id, subject, order_id]);
    
    return result.rows[0];
  },

  async findByUserId(userId) {
    const result = await pool.query(`
      SELECT c.*, 
             u.name as user_name,
             u.email as user_email,
             a.name as admin_name,
             COUNT(m.id) as message_count,
             MAX(m.created_at) as last_message_at
      FROM conversations c
      LEFT JOIN users u ON c.user_id = u.id
      LEFT JOIN users a ON c.admin_id = a.id
      LEFT JOIN messages m ON c.id = m.conversation_id
      WHERE c.user_id = $1
      GROUP BY c.id, u.name, u.email, a.name
      ORDER BY last_message_at DESC NULLS LAST
    `, [userId]);
    
    return result.rows;
  },

  // models/Conversation.js - AJOUTER CETTE MÉTHODE
async updateLastRead(userId, conversationId) {
  const field = req.user.role === 'admin' ? 'admin_last_read' : 'user_last_read';
  
  const result = await pool.query(`
    UPDATE conversations 
    SET ${field} = CURRENT_TIMESTAMP
    WHERE id = $1
    RETURNING *
  `, [conversationId]);
  
  return result.rows[0];
},

  async findAll() {
    const result = await pool.query(`
      SELECT c.*, 
             u.name as user_name,
             u.email as user_email,
             u.company as user_company,
             a.name as admin_name,
             COUNT(m.id) as message_count,
             MAX(m.created_at) as last_message_at
      FROM conversations c
      LEFT JOIN users u ON c.user_id = u.id
      LEFT JOIN users a ON c.admin_id = a.id
      LEFT JOIN messages m ON c.id = m.conversation_id
      GROUP BY c.id, u.name, u.email, u.company, a.name
      ORDER BY last_message_at DESC NULLS LAST
    `);
    
    return result.rows;
  },

  async findById(id) {
    const result = await pool.query(`
      SELECT c.*, 
             u.name as user_name,
             u.email as user_email,
             u.company as user_company,
             a.name as admin_name
      FROM conversations c
      LEFT JOIN users u ON c.user_id = u.id
      LEFT JOIN users a ON c.admin_id = a.id
      WHERE c.id = $1
    `, [id]);
    
    return result.rows[0];
  },

  async updateLastRead(userId, conversationId) {
    const result = await pool.query(`
      UPDATE conversations 
      SET user_last_read = CURRENT_TIMESTAMP
      WHERE id = $1 AND user_id = $2
      RETURNING *
    `, [conversationId, userId]);
    
    return result.rows[0];
  }
};