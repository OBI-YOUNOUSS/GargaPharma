import pkg from 'pg';
const { Pool } = pkg;

// Configuration pour l'authentification peer (sans mot de passe)
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'gargapharma',
  password: '78GargaP', // Laissez vide pour authentification peer
  port: 5432,
});

export default pool;
