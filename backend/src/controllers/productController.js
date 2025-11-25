// controllers/productController.js
import pool from '../config/database.js';

export const productController = {
  // GET /api/products
  getProducts: async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM products');
      res.json({ success: true, data: result.rows });
    } catch (error) {
      console.error('❌ getProducts error:', error);
      res.status(500).json({ success: false, message: 'Erreur récupération produits' });
    }
  },

  // GET /api/products/:id
  getProductById: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
      if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Produit non trouvé' });
      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      console.error('❌ getProductById error:', error);
      res.status(500).json({ success: false, message: 'Erreur récupération produit' });
    }
  },

  // POST /api/products
  createProduct: async (req, res) => {
  try {
    console.log('=== 🚨 CREATE PRODUCT DEBUG ===');
    console.log('📝 Body:', req.body);
    console.log('🖼️ File:', req.file); // Doit maintenant afficher le fichier
    
    const {
      name,
      description,
      price,
      stock_quantity,
      category_id,
      prescription_required = false
    } = req.body;

    // Validation
    if (!name || !price || !category_id) {
      return res.status(400).json({ 
        success: false, 
        message: 'Nom, prix et catégorie sont requis' 
      });
    }

    // Gestion de l'image
    let imageFileName = null;
    if (req.file) {
      imageFileName = req.file.filename; // Nom du fichier sauvegardé
      console.log('✅ Image sauvegardée:', imageFileName);
    }

    // Requête SQL avec colonne "image"
    const query = `
      INSERT INTO products 
        (name, description, price, stock_quantity, category_id, prescription_required, image)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    
    const values = [
      name, 
      description || '', 
      parseFloat(price), 
      parseInt(stock_quantity) || 0, 
      parseInt(category_id), 
      prescription_required === 'true',
      imageFileName
    ];

    console.log('📋 Requête SQL avec valeurs:', values);

    const result = await pool.query(query, values);
    
    console.log('✅ Produit créé avec ID:', result.rows[0].id);

    res.status(201).json({ 
      success: true, 
      message: 'Produit créé avec succès',
      data: result.rows[0] 
    });

  } catch (error) {
    console.error('💥 ERREUR createProduct:', error);
    
    if (error.code === '23505') {
      return res.status(400).json({ 
        success: false, 
        message: 'Un produit avec ce nom existe déjà' 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur lors de la création du produit',
      error: error.message 
    });
  }
},

  // PUT /api/products/:id
  updateProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const {
        name,
        description,
        price,
        stock_quantity,
        category_id,
        prescription_required
      } = req.body;

      // Image
      let imageFileName = req.body.currentImage || null; // garder l'image actuelle si pas upload
      if (req.file) imageFileName = req.file.filename;

      const query = `
        UPDATE products SET
          name = $1,
          description = $2,
          price = $3,
          stock_quantity = $4,
          category_id = $5,
          prescription_required = $6,
          image = $7,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $8
        RETURNING *
      `;
      const values = [name, description, price, stock_quantity, category_id, prescription_required, imageFileName, id];

      const result = await pool.query(query, values);
      if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Produit non trouvé' });

      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      console.error('❌ updateProduct error:', error);
      res.status(500).json({ success: false, message: 'Erreur mise à jour produit' });
    }
  },

  // DELETE /api/products/:id
  deleteProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
      if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Produit non trouvé' });
      res.json({ success: true, message: 'Produit supprimé' });
    } catch (error) {
      console.error('❌ deleteProduct error:', error);
      res.status(500).json({ success: false, message: 'Erreur suppression produit' });
    }
  },
};
