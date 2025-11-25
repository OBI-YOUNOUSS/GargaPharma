import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import path from 'path';



// Routes
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import authRoutes from './routes/auth.js';
import contactRoutes from './routes/contact.js';
import catalogRoutes from './routes/catalogs.js';
import adminRoutes from './routes/admin.js';
import conversationRoutes from './routes/conversations.js';

dotenv.config();

const app = express();

// Middleware de sécurité
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

// Middleware
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers uploadés
app.use(
  '/uploads',
  express.static(path.join(process.cwd(), 'uploads'), {
    setHeaders: (res) => {
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    }
  })
);

// Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/catalogs', catalogRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/conversations', conversationRoutes);

// Route de santé
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'API GARGAPharma en ligne',
    timestamp: new Date().toISOString()
  });
});




// Gestion des erreurs 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée'
  });
});

// Middleware de gestion d'erreurs global
app.use((error, req, res, next) => {
  console.error('Erreur:', error);
  
  res.status(500).json({
    success: false,
    message: 'Erreur interne du serveur',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Erreur interne'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Serveur backend démarré sur le port ${PORT}`);
  console.log(`📊 Environnement: ${process.env.NODE_ENV || 'development'}`);
});