import jwt from 'jsonwebtoken';
import pool from '../config/database.js';


export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token d\'authentification manquant'
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('🔐 Token décodé:', decoded);
    
    const userId = decoded.id; 
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Token invalide: ID utilisateur manquant'
      });
    }
    
    const result = await pool.query(
      'SELECT id, email, name, role, company, phone FROM users WHERE id = $1',
      [userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }
    
    req.user = result.rows[0];
    console.log('👤 User attaché à la requête:', req.user);
    next();
  } catch (error) {
    console.error('❌ Erreur auth middleware:', error);
    res.status(401).json({
      success: false,
      message: 'Token invalide'
    });
  }
};

// AJOUTEZ CE MIDDLEWARE ADMIN
export const adminMiddleware = (req, res, next) => {
  try {
    console.log('🔧 Vérification des droits admin:', req.user);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Accès non autorisé - authentification requise'
      });
    }

    // Vérifier si l'utilisateur est admin
    // Adaptez cette condition selon votre logique de rôle
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Accès refusé - droits administrateur requis'
      });
    }

    console.log('✅ Accès admin autorisé pour:', req.user.email);
    next();
  } catch (error) {
    console.error('❌ Erreur admin middleware:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur de vérification des droits administrateur'
    });
  }
};

// Optionnel: Middleware pour les utilisateurs standard
export const userMiddleware = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentification requise'
    });
  }
  next();
};