import pool from './database.js';
import bcrypt from 'bcryptjs';

const createTables = async () => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // -------------------------------
    // Table des utilisateurs
    // -------------------------------
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'customer',
        company VARCHAR(255),
        phone VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // -------------------------------
    // Table des catégories
    // -------------------------------
    await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // -------------------------------
    // Table des produits
    // -------------------------------
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        category_id INT REFERENCES categories(id) ON DELETE SET NULL,
        price DECIMAL(10,2) NOT NULL,
        description TEXT,
        image VARCHAR(255),
        prescription_required BOOLEAN DEFAULT FALSE,
        stock_quantity INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // -------------------------------
    // Table des commandes
    // -------------------------------
    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id),
        total_amount DECIMAL(10,2) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        shipping_address TEXT,
        customer_name VARCHAR(255),
        customer_email VARCHAR(255),
        customer_phone VARCHAR(50),
        notes TEXT,
        prescription_verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // -------------------------------
    // Table des items de commande
    // -------------------------------
    await client.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INT REFERENCES orders(id) ON DELETE CASCADE,
        product_id INT REFERENCES products(id),
        quantity INT NOT NULL,
        unit_price DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // -------------------------------
// Table des messages de contact
// -------------------------------
await client.query(`
  CREATE TABLE IF NOT EXISTS contact_messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    company VARCHAR(255),
    subject VARCHAR(500),
    message TEXT NOT NULL,
    message_type VARCHAR(50) DEFAULT 'general',
    needs TEXT,
    file_path VARCHAR(500),
    is_read BOOLEAN DEFAULT FALSE,
    status VARCHAR(50) DEFAULT 'new',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);

// -------------------------------
// Index pour les performances
// -------------------------------
await client.query(`
  CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
  CREATE INDEX IF NOT EXISTS idx_contact_messages_is_read ON contact_messages(is_read);
  CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at);
`);

// -------------------------------
// Trigger pour updated_at automatique
// -------------------------------
await client.query(`
  CREATE OR REPLACE FUNCTION contact_messages_update_timestamp()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;
`);

await client.query(`
  DROP TRIGGER IF EXISTS contact_messages_updated_at_trigger ON contact_messages;
`);

await client.query(`
  CREATE TRIGGER contact_messages_updated_at_trigger
  BEFORE UPDATE ON contact_messages
  FOR EACH ROW
  EXECUTE FUNCTION contact_messages_update_timestamp();
`);

    // -------------------------------
    // Table des notifications
    // -------------------------------
    await client.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        order_id INT REFERENCES orders(id) ON DELETE SET NULL,
        conversation_id INT, -- Référence sera ajoutée après création de la table
        type VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // -------------------------------
    // Table des catalogues
    // -------------------------------
    await client.query(`
      CREATE TABLE IF NOT EXISTS catalogs (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        file_path VARCHAR(500) NOT NULL,
        file_size INT,
        category VARCHAR(100),
        requires_auth BOOLEAN DEFAULT FALSE,
        download_count INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // -------------------------------
    // NOUVELLES TABLES POUR LA COMMUNICATION
    // -------------------------------

    // Table des conversations
    await client.query(`
      CREATE TABLE IF NOT EXISTS conversations (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        admin_id INT REFERENCES users(id) ON DELETE SET NULL,
        subject VARCHAR(500) NOT NULL,
        order_id INT REFERENCES orders(id) ON DELETE SET NULL,
        status VARCHAR(50) DEFAULT 'open',
        user_last_read TIMESTAMP,
        admin_last_read TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Table des messages
    await client.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        conversation_id INT REFERENCES conversations(id) ON DELETE CASCADE,
        sender_id INT REFERENCES users(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        message_type VARCHAR(50) DEFAULT 'text',
        file_path VARCHAR(500),
        is_read BOOLEAN DEFAULT FALSE,
        read_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // -------------------------------
    // Mise à jour de la table notifications pour ajouter la référence
    // -------------------------------
    await client.query(`
      ALTER TABLE notifications 
      ADD CONSTRAINT fk_notifications_conversation 
      FOREIGN KEY (conversation_id) 
      REFERENCES conversations(id) ON DELETE SET NULL
    `);

    // -------------------------------
    // Index pour les performances
    // -------------------------------
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
      CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
      CREATE INDEX IF NOT EXISTS idx_notifications_conversation_id ON notifications(conversation_id);
    `);

    // Index pour les conversations
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
      CREATE INDEX IF NOT EXISTS idx_conversations_admin_id ON conversations(admin_id);
      CREATE INDEX IF NOT EXISTS idx_conversations_status ON conversations(status);
      CREATE INDEX IF NOT EXISTS idx_conversations_updated_at ON conversations(updated_at);
    `);

    // Index pour les messages
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
      CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
      CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
      CREATE INDEX IF NOT EXISTS idx_messages_is_read ON messages(is_read);
    `);

    // -------------------------------
    // Trigger pour updated_at automatique
    // -------------------------------
    const tablesWithUpdatedAt = [
      'users', 'categories', 'products', 'orders', 'catalogs', 'conversations'
    ];

    for (const table of tablesWithUpdatedAt) {
      await client.query(`
        CREATE OR REPLACE FUNCTION ${table}_update_timestamp()
        RETURNS TRIGGER AS $$
        BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
      `);

      await client.query(`
        DROP TRIGGER IF EXISTS ${table}_updated_at_trigger ON ${table};
      `);

      await client.query(`
        CREATE TRIGGER ${table}_updated_at_trigger
        BEFORE UPDATE ON ${table}
        FOR EACH ROW
        EXECUTE FUNCTION ${table}_update_timestamp();
      `);
    }

    // -------------------------------
    // Données initiales
    // -------------------------------
    await client.query(`
      INSERT INTO categories (name, description) VALUES
      ('Médicaments', 'Médicaments et produits pharmaceutiques'),
      ('Matériel Médical', 'Équipements et instruments médicaux'),
      ('Consommables', 'Produits consommables médicaux'),
      ('Équipement', 'Équipement médical lourd')
      ON CONFLICT (name) DO NOTHING
    `);

    await client.query(`
      INSERT INTO products (name, description, price, category_id, prescription_required, stock_quantity) VALUES
      ('Doliprane 500mg', 'Boite de 10 comprimés', 1500, 1, false, 100),
      ('Amoxicilline 500mg', 'Boite de 10 plaquettes', 4000, 1, true, 50),
      ('Stéthoscope Professionnel', 'Stéthoscope double pavillon', 15000, 2, false, 25),
      ('Gants Médicaux', 'Boite de 100 gants', 5000, 3, false, 200),
      ('Tensiomètre Digital', 'Tensiomètre bras électronique', 25000, 2, false, 30),
      ('Vitamine C 1000mg', 'Boite de 20 comprimés', 2000, 1, false, 75)
      ON CONFLICT (name) DO NOTHING
    `);

    // -------------------------------
    // Admin par défaut
    // -------------------------------
    const hashedPassword = await bcrypt.hash('admin123', 12);
    await client.query(`
      INSERT INTO users (email, password, name, role, company)
      VALUES ('admin@gargapharma.td', $1, 'Administrateur', 'admin', 'GARGAPharma')
      ON CONFLICT (email) DO NOTHING
    `, [hashedPassword]);

    // -------------------------------
    // Données de démonstration pour les conversations
    // -------------------------------
    await client.query(`
      INSERT INTO users (email, password, name, role, company, phone) VALUES
      ('client1@example.td', $1, 'Dr. Martin Dubois', 'customer', 'Clinique La Providence', '+235 70 12 34 56'),
      ('client2@example.td', $1, 'Pharmacie Centrale', 'customer', 'Pharmacie Centrale de Moundou', '+235 22 33 44 55')
      ON CONFLICT (email) DO NOTHING
    `, [await bcrypt.hash('password123', 12)]);

    // Récupérer l'ID de l'admin
    const adminResult = await client.query(
      "SELECT id FROM users WHERE email = 'admin@gargapharma.td'"
    );
    const adminId = adminResult.rows[0]?.id;

    // Récupérer les IDs des clients
    const client1Result = await client.query(
      "SELECT id FROM users WHERE email = 'client1@example.td'"
    );
    const client1Id = client1Result.rows[0]?.id;

    const client2Result = await client.query(
      "SELECT id FROM users WHERE email = 'client2@example.td'"
    );
    const client2Id = client2Result.rows[0]?.id;

    // Créer des conversations de démonstration
    if (adminId && client1Id) {
      await client.query(`
        INSERT INTO conversations (user_id, admin_id, subject, status) VALUES
        ($1, $2, 'Question sur les délais de livraison', 'open'),
        ($1, $2, 'Demande de devis pour matériel médical', 'open')
        ON CONFLICT DO NOTHING
      `, [client1Id, adminId]);
    }

    if (adminId && client2Id) {
      await client.query(`
        INSERT INTO conversations (user_id, admin_id, subject, status) VALUES
        ($1, $2, 'Problème avec ma commande #12345', 'resolved')
        ON CONFLICT DO NOTHING
      `, [client2Id, adminId]);
    }

    // Récupérer l'ID de la première conversation pour ajouter des messages
    const conversationResult = await client.query(
      "SELECT id FROM conversations WHERE subject = 'Question sur les délais de livraison'"
    );
    const conversationId = conversationResult.rows[0]?.id;

    // Ajouter des messages de démonstration
    if (conversationId && client1Id && adminId) {
      await client.query(`
        INSERT INTO messages (conversation_id, sender_id, content) VALUES
        ($1, $2, 'Bonjour, je souhaiterais connaître les délais de livraison pour la région de Moundou.'),
        ($1, $3, 'Bonjour Dr. Dubois, les délais de livraison sont de 24 à 48 heures pour Moundou.'),
        ($1, $2, 'Parfait, merci pour cette information rapide.'),
        ($1, $3, 'Je vous en prie ! N''hésitez pas si vous avez d''autres questions.')
        ON CONFLICT DO NOTHING
      `, [conversationId, client1Id, adminId]);
    }

    await client.query('COMMIT');
    console.log('✅ Base de données initialisée avec succès!');
    console.log('🗣️  Système de communication client-admin installé!');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Erreur lors de l initialisation:', error);
    throw error;
  } finally {
    client.release();
  }
};

createTables()
  .then(() => {
    console.log('🚀 Migrations terminées');
    console.log('📧 Compte admin: admin@gargapharma.td / admin123');
    console.log('👥 Comptes de démonstration créés');
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 Erreur migrations:', error);
    process.exit(1);
  });