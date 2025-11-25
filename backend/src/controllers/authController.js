import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { validationResult } from 'express-validator';

// CORRECTION: Utiliser "id" au lieu de "userId" pour être cohérent
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

export const authController = {
  async register(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Données invalides',
          errors: errors.array()
        });
      }

      const { email, password, name, company, phone } = req.body;

      // Vérifier si l'utilisateur existe déjà
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Un utilisateur avec cet email existe déjà'
        });
      }

      // Créer l'utilisateur
      const user = await User.create({ email, password, name, company, phone });
      const token = generateToken(user.id);

      res.status(201).json({
        success: true,
        message: 'Utilisateur créé avec succès',
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            company: user.company,
            phone: user.phone
          },
          token
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la création du compte',
        error: error.message
      });
    }
  },

  async login(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Données invalides',
          errors: errors.array()
        });
      }

      const { email, password } = req.body;

      // Trouver l'utilisateur
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Email ou mot de passe incorrect'
        });
      }

      // Vérifier le mot de passe
      const isPasswordValid = await User.comparePassword(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Email ou mot de passe incorrect'
        });
      }

      const token = generateToken(user.id);

      res.json({
        success: true,
        message: 'Connexion réussie',
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            company: user.company,
            phone: user.phone
          },
          token
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur: ' + error.message,
        error: error.message
      });
    }
  },

  async getProfile(req, res) {
    try {
      const user = await User.findById(req.user.id);
      
      res.json({
        success: true,
        data: { user }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération du profil',
        error: error.message
      });
    }
  }
};