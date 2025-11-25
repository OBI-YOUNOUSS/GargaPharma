import pool from '../config/database.js';
import bcrypt from 'bcryptjs';

export const User = {
  async findByEmail(email) {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0];
  },

  async findById(id) {
    const result = await pool.query(
      'SELECT id, email, name, role, company, phone, created_at FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0];
  },

  async create(userData) {
    const { email, password, name, company, phone } = userData;
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const result = await pool.query(`
      INSERT INTO users (email, password, name, company, phone)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, email, name, role, company, phone, created_at
    `, [email, hashedPassword, name, company, phone]);
    
    return result.rows[0];
  },

  async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  },

  async updateProfile(userId, userData) {
    const { name, company, phone } = userData;
    
    const result = await pool.query(`
      UPDATE users 
      SET name = $1, company = $2, phone = $3, updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING id, email, name, role, company, phone
    `, [name, company, phone, userId]);
    
    return result.rows[0];
  },

  async count() {
    const result = await pool.query('SELECT COUNT(*) FROM users');
    return parseInt(result.rows[0].count);
  },

  async update(userId, userData) {
    const { name, company, phone } = userData;
    
    const result = await pool.query(`
      UPDATE users 
      SET name = $1, company = $2, phone = $3, updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING id, email, name, role, company, phone
    `, [name, company, phone, userId]);
    
    return result.rows[0];
  }
};