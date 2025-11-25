// src/models/Contact.js
import pool from '../config/database.js';

export const Contact = {
  async create(messageData) {
    const { name, email, phone, company, subject, message, message_type, needs, file_path } = messageData;
    
    const result = await pool.query(`
      INSERT INTO contact_messages (name, email, phone, company, subject, message, message_type, needs, file_path)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `, [name, email, phone, company, subject, message, message_type, needs, file_path]);
    
    return result.rows[0];
  },

  async findAll() {
    const result = await pool.query(`
      SELECT * FROM contact_messages 
      ORDER BY created_at DESC
    `);
    return result.rows;
  },

  async markAsRead(id) {
    const result = await pool.query(`
      UPDATE contact_messages 
      SET is_read = true 
      WHERE id = $1
      RETURNING *
    `, [id]);
    return result.rows[0];
  },

  async updateStatus(id, status) {
    const result = await pool.query(`
      UPDATE contact_messages 
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `, [status, id]);
    return result.rows[0];
  },

  async findById(id) {
    const result = await pool.query(`
      SELECT * FROM contact_messages 
      WHERE id = $1
    `, [id]);
    return result.rows[0];
  },

  async delete(id) {
    const result = await pool.query(`
      DELETE FROM contact_messages 
      WHERE id = $1
      RETURNING *
    `, [id]);
    return result.rows[0];
  }
};