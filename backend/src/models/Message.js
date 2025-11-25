// src/models/Message.js
import pool from '../config/database.js';

export const Message = {
  async create(messageData) {
    const { conversation_id, sender_id, content, message_type = 'text', file_path = null } = messageData;
    
    const result = await pool.query(`
      INSERT INTO messages (conversation_id, sender_id, content, message_type, file_path)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [conversation_id, sender_id, content, message_type, file_path]);
    
    return result.rows[0];
  },

  async findByConversationId(conversationId) {
    const result = await pool.query(`
      SELECT m.*, 
             u.name as sender_name,
             u.role as sender_role,
             u.company as sender_company
      FROM messages m
      LEFT JOIN users u ON m.sender_id = u.id
      WHERE m.conversation_id = $1
      ORDER BY m.created_at ASC
    `, [conversationId]);
    
    return result.rows;
  },

  async markAsRead(messageId, userId) {
    const result = await pool.query(`
      UPDATE messages 
      SET is_read = true,
          read_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND sender_id != $2
      RETURNING *
    `, [messageId, userId]);
    
    return result.rows[0];
  },

  async getUnreadCount(userId) {
    const result = await pool.query(`
      SELECT COUNT(*) as unread_count
      FROM messages m
      JOIN conversations c ON m.conversation_id = c.id
      WHERE m.is_read = false 
      AND m.sender_id != $1
      AND c.user_id = $1
    `, [userId]);
    
    return parseInt(result.rows[0].unread_count);
  }
};