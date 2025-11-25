// models/Catalog.js
import pool from '../config/database.js';

export const Catalog = {
  async findAll() {
    const result = await pool.query(`
      SELECT * FROM catalogs 
      WHERE is_active = true
      ORDER BY created_at DESC
    `);
    return result.rows;
  },

  async findById(id) {
    const result = await pool.query(
      'SELECT * FROM catalogs WHERE id = $1 AND is_active = true',
      [id]
    );
    return result.rows[0];
  },

  async create(catalogData) {
    const { title, description, file_path, file_size, category, requires_auth } = catalogData;
    
    const result = await pool.query(`
      INSERT INTO catalogs (title, description, file_path, file_size, category, requires_auth)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [title, description, file_path, file_size, category, requires_auth]);
    
    return result.rows[0];
  },

  async incrementDownloadCount(id) {
    const result = await pool.query(`
      UPDATE catalogs 
      SET download_count = download_count + 1
      WHERE id = $1
      RETURNING *
    `, [id]);
    return result.rows[0];
  }
};