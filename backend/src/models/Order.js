import pool from '../config/database.js';

export const Order = {
  async create(orderData) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      const { user_id, items, customer_name, customer_email, customer_phone, shipping_address, notes } = orderData;
      
      console.log('📦 Données reçues dans Order.create:', orderData);
      
      // Calculer le total
      const total = items.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);
      
      console.log('💰 Total calculé:', total);
      
      // Créer la commande
      const orderResult = await client.query(`
        INSERT INTO orders (user_id, total_amount, customer_name, customer_email, customer_phone, shipping_address, notes)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `, [user_id, total, customer_name, customer_email, customer_phone, shipping_address, notes]);
      
      const order = orderResult.rows[0];
      console.log('✅ Commande créée en base:', order.id);
      
      // Ajouter les items de commande
      for (const item of items) {
        console.log('📝 Ajout item:', item);
        
        await client.query(`
          INSERT INTO order_items (order_id, product_id, quantity, unit_price)
          VALUES ($1, $2, $3, $4)
        `, [order.id, item.product_id, item.quantity, item.unit_price]);
        
        console.log('✅ Item ajouté pour produit:', item.product_id);
        
        // Mettre à jour le stock avec gestion d'erreur
        const updateResult = await client.query(`
          UPDATE products 
          SET stock_quantity = stock_quantity - $1,
              updated_at = CURRENT_TIMESTAMP
          WHERE id = $2
          RETURNING stock_quantity
        `, [item.quantity, item.product_id]);
        
        if (updateResult.rows.length === 0) {
          throw new Error(`Produit non trouvé: ${item.product_id}`);
        }
        
        console.log('📊 Stock mis à jour pour produit:', item.product_id);
      }
      
      await client.query('COMMIT');
      console.log('🎉 Transaction commitée avec succès');
      return order;
      
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('💥 ERREUR dans Order.create:', error);
      throw error;
    } finally {
      client.release();
    }
  },
  
  
  async findByUserId(userId) {
    const result = await pool.query(`
      SELECT o.*, 
             json_agg(
               json_build_object(
                 'id', oi.id,
                 'product_id', oi.product_id,
                 'product_name', p.name,
                 'quantity', oi.quantity,
                 'unit_price', oi.unit_price,
                 'total', oi.quantity * oi.unit_price
               )
             ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE o.user_id = $1
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `, [userId]);
    
    return result.rows;
  },
  

  async findAll() {
  const result = await pool.query(`
    SELECT 
      o.*,
      -- Utiliser COALESCE pour prendre customer_* si user_* est null
      COALESCE(o.customer_name, u.name) as user_name,
      COALESCE(o.customer_email, u.email) as user_email,
      COALESCE(o.customer_phone, u.phone) as user_phone,
      json_agg(
        json_build_object(
          'id', oi.id,
          'product_id', oi.product_id,
          'product_name', p.name,
          'quantity', oi.quantity,
          'unit_price', oi.unit_price,
          'prescription_required', p.prescription_required
        )
      ) as items
    FROM orders o
    LEFT JOIN users u ON o.user_id = u.id
    LEFT JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN products p ON oi.product_id = p.id
    GROUP BY o.id, u.id, u.name, u.email, u.phone
    ORDER BY o.created_at DESC
  `);
  
  // Debug pour vérifier les données
  console.log('📦 Commandes récupérées avec infos client:');
  result.rows.forEach(order => {
    console.log(`🔍 Commande ${order.id}:`, {
      user_name: order.user_name,
      user_email: order.user_email,
      user_phone: order.user_phone,
      customer_name: order.customer_name,
      customer_email: order.customer_email,
      customer_phone: order.customer_phone
    });
  });
  
  return result.rows;
},

  async updateStatus(orderId, status) {
    const result = await pool.query(`
      UPDATE orders 
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `, [status, orderId]);
    
    return result.rows[0];
  },

  async count() {
    const result = await pool.query('SELECT COUNT(*) FROM orders');
    return parseInt(result.rows[0].count);
  },

  async sum(column) {
    const result = await pool.query(`SELECT SUM(${column}) FROM orders WHERE status = 'paid'`);
    return parseFloat(result.rows[0].sum) || 0;
  },

  async findById(id) {
    const result = await pool.query(`
      SELECT o.*, 
             json_agg(
               json_build_object(
                 'id', oi.id,
                 'product_id', oi.product_id,
                 'product_name', p.name,
                 'quantity', oi.quantity,
                 'unit_price', oi.unit_price,
                 'total', oi.quantity * oi.unit_price
               )
             ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE o.id = $1
      GROUP BY o.id
    `, [id]);
    
    return result.rows[0];
  }
};