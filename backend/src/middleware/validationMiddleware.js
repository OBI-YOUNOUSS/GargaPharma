import { body } from 'express-validator';

export const validateProduct = [
  body('name').notEmpty().withMessage('Le nom est requis'),
  body('price').isFloat({ min: 0 }).withMessage('Le prix doit être un nombre positif'),
  body('category_id').isInt({ min: 1 }).withMessage('La catégorie est requise')
];


export const validateOrder = [
  body('items').isArray({ min: 1 }).withMessage('Au moins un produit est requis'),
  body('customer_name').notEmpty().withMessage('Le nom est requis'),
  body('customer_email').isEmail().withMessage('Email invalide'),
  body('customer_phone').notEmpty().withMessage('Le téléphone est requis'),
  body('shipping_address').notEmpty().withMessage('L\'adresse est requise')
];

export const validateAuth = [
  body('email').isEmail().withMessage('Email invalide'),
  body('password').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères')
];

export const validateContact = [
  body('name').notEmpty().withMessage('Le nom est requis'),
  body('email').isEmail().withMessage('Email invalide'),
  body('message').notEmpty().withMessage('Le message est requis')
];

