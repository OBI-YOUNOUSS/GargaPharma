import pool from '../config/database.js'; // ✅ CORRECTION: db → pool

export const Product = {
  async findAll({ category, search, page = 1, limit = 12 } = {}) {
    try {
      console.log('🔍 Recherche produits avec filtres:', { category, search });

      let query = `
        SELECT 
          p.*,
          c.name as category_name
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE 1=1
      `;
      let params = [];
      let paramIndex = 1;

      // Filtre catégorie
      if (category && category !== 'all') {
        query += ` AND c.name = $${paramIndex++}`;
        params.push(category);
      }

      // Filtre recherche
      if (search) {
        query += ` AND (p.name ILIKE $${paramIndex} OR p.description ILIKE $${paramIndex + 1})`;
        params.push(`%${search}%`, `%${search}%`);
        paramIndex += 2;
      }

      // Pagination
      const offset = (page - 1) * limit;
      query += ` ORDER BY p.created_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
      params.push(parseInt(limit), offset);

      console.log('📋 SQL:', query);
      console.log('🔧 Params:', params);

      const result = await pool.query(query, params); // ✅ CORRECTION: db → pool
      const products = result.rows;

      // Construire URL image COMPLÈTE
      const productsWithImageUrls = products.map(product => {
        let imageUrl = null;
        
        // Si l'image existe dans la base
        if (product.image) {
          // Construire l'URL complète avec localhost
          imageUrl = `http://localhost:5000/uploads/${product.image}`;
          console.log(`🖼️ Image pour ${product.name}: ${imageUrl}`);
        }
        
        return {
          ...product,
          image_url: imageUrl, // URL complète pour le frontend
          image: imageUrl      // Compatibilité
        };
      });

      // --- Compter total ---
      let countQuery = `
        SELECT COUNT(*) as total
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE 1=1
      `;
      let countParams = [];
      let countIndex = 1;

      if (category && category !== 'all') {
        countQuery += ` AND c.name = $${countIndex++}`;
        countParams.push(category);
      }

      if (search) {
        countQuery += ` AND (p.name ILIKE $${countIndex} OR p.description ILIKE $${countIndex + 1})`;
        countParams.push(`%${search}%`, `%${search}%`);
        countIndex += 2;
      }

      const countResult = await pool.query(countQuery, countParams); // ✅ CORRECTION: db → pool
      const total = parseInt(countResult.rows[0].total);

      return {
        products: productsWithImageUrls,
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      };

    } catch (error) {
      console.error('💥 Erreur Product.findAll:', error);
      throw error;
    }
  },

  async findById(id) {
    try {
      const result = await pool.query( // ✅ CORRECTION: db → pool
        `
        SELECT p.*, c.name as category_name
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.id = $1
        `,
        [id]
      );

      if (result.rows.length === 0) return null;

      const product = result.rows[0];

      // URL complète
      let imageUrl = null;
      if (product.image) {
        imageUrl = `http://localhost:5000/uploads/${product.image}`;
      }

      return {
        ...product,
        image_url: imageUrl,
        image: imageUrl
      };

    } catch (error) {
      console.error('💥 Erreur Product.findById:', error);
      throw error;
    }
  },

  async create(productData) {
    try {
      const {
        name,
        category_id,
        price,
        description,
        image, // Reçu du controller
        prescription_required = false,
        stock_quantity = 0
      } = productData;

      // Utiliser "image" (nom de colonne dans la table)
      const result = await pool.query( // ✅ CORRECTION: db → pool
        `
        INSERT INTO products 
        (name, category_id, price, description, image, prescription_required, stock_quantity)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
        `,
        [name, category_id, price, description, image, prescription_required, stock_quantity]
      );

      const createdProduct = result.rows[0];

      // Retourner avec URL complète
      let imageUrl = null;
      if (createdProduct.image) {
        imageUrl = `http://localhost:5000/uploads/${createdProduct.image}`;
      }

      return {
        ...createdProduct,
        image_url: imageUrl,
        image: imageUrl
      };

    } catch (error) {
      console.error('💥 Erreur Product.create:', error);
      throw error;
    }
  },

  async update(id, productData) {
    try {
      const {
        name,
        category_id,
        price,
        description,
        image,
        prescription_required = false,
        stock_quantity = 0
      } = productData;

      const result = await pool.query( // ✅ CORRECTION: db → pool
        `
        UPDATE products
        SET 
          name = $1,
          category_id = $2,
          price = $3,
          description = $4,
          image = $5,
          prescription_required = $6,
          stock_quantity = $7,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $8
        RETURNING *
        `,
        [name, category_id, price, description, image, prescription_required, stock_quantity, id]
      );

      if (result.rows.length === 0) return null;

      const updatedProduct = result.rows[0];

      // URL complète
      let imageUrl = null;
      if (updatedProduct.image) {
        imageUrl = `http://localhost:5000/uploads/${updatedProduct.image}`;
      }

      return {
        ...updatedProduct,
        image_url: imageUrl,
        image: imageUrl
      };

    } catch (error) {
      console.error('💥 Erreur Product.update:', error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const result = await pool.query( // ✅ CORRECTION: db → pool
        `DELETE FROM products WHERE id = $1 RETURNING *`,
        [id]
      );

      if (result.rows.length === 0) return null;

      return result.rows[0];

    } catch (error) {
      console.error('💥 Erreur Product.delete:', error);
      throw error;
    }
  },

  // 🔥 AJOUT: Méthodes manquantes pour les statistiques admin
  async getLowStock(threshold = 5) {
    const result = await pool.query(
      'SELECT * FROM products WHERE stock_quantity <= $1 AND stock_quantity > 0',
      [threshold]
    );
    return result.rows;
  },

  async count() {
    const result = await pool.query('SELECT COUNT(*) FROM products');
    return parseInt(result.rows[0].count);
  }
};