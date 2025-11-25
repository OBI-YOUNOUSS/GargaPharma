import multer from 'multer';
import path from 'path';
import fs from 'fs';

// S'assurer que le dossier uploads existe
const ensureUploadsDir = () => {
  const dir = 'uploads';
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log('✅ Dossier uploads créé');
  }
};

ensureUploadsDir();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'product-' + uniqueSuffix + ext);
  }
});

export const uploadProductImage = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    console.log('🖼️ Fichier reçu:', file.originalname, file.mimetype);
    
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      console.log('❌ Type de fichier rejeté:', file.mimetype);
      cb(new Error('Seuls les fichiers image sont autorisés'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

console.log('✅ Middleware multer configuré');