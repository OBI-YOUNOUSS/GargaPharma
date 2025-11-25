// src/controllers/catalogController.js
import { Catalog } from '../models/Catalog.js';
import { validationResult } from 'express-validator';

export const catalogController = {
  async getCatalogs(req, res) {
    try {
      const catalogs = await Catalog.findAll();
      
      res.json({
        success: true,
        data: catalogs
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des catalogues',
        error: error.message
      });
    }
  },

  async getCatalogById(req, res) {
    try {
      const catalog = await Catalog.findById(req.params.id);
      
      if (!catalog) {
        return res.status(404).json({
          success: false,
          message: 'Catalogue non trouvé'
        });
      }
      
      res.json({
        success: true,
        data: catalog
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération du catalogue',
        error: error.message
      });
    }
  },

  async createCatalog(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Données invalides',
          errors: errors.array()
        });
      }

      const catalogData = {
        ...req.body,
        file_path: req.file ? `/uploads/catalogs/${req.file.filename}` : null
      };

      const catalog = await Catalog.create(catalogData);
      
      res.status(201).json({
        success: true,
        message: 'Catalogue créé avec succès',
        data: catalog
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la création du catalogue',
        error: error.message
      });
    }
  },

  async downloadCatalog(req, res) {
    try {
      const catalog = await Catalog.findById(req.params.id);
      
      if (!catalog) {
        return res.status(404).json({
          success: false,
          message: 'Catalogue non trouvé'
        });
      }

      // Incrémenter le compteur de téléchargements
      await Catalog.incrementDownloadCount(req.params.id);

      // Pour l'instant, retourner le chemin du fichier
      // Dans une vraie application, vous utiliseriez res.download()
      res.json({
        success: true,
        message: 'Prêt pour le téléchargement',
        data: {
          fileUrl: catalog.file_path,
          catalog
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors du téléchargement',
        error: error.message
      });
    }
  }
};