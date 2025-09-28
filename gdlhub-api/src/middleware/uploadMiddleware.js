import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Crear directorios si no existen
const uploadDirs = [
  'uploads/avatars',
  'uploads/ine',
  'uploads/dishes',
  'uploads/profiles'
];

if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configuración de multer para avatares
const avatarStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/avatars');
  },
  filename: function (req, file, cb) {
    const uniqueName = `avatar-${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// Configuración para imágenes de INE
const ineStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/ine');
  },
  filename: function (req, file, cb) {
    const uniqueName = `ine-${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// Configuración para imágenes de platillos
const dishStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/dishes');
  },
  filename: function (req, file, cb) {
    const uniqueName = `dish-${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// Configuración para imágenes de perfil
const profileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/profiles');
  },
  filename: function (req, file, cb) {
    const uniqueName = `profile-${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// Filtro para solo permitir imágenes
const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos de imagen'), false);
  }
};

// Configuraciones de multer
export const uploadAvatar = multer({
  storage: avatarStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB máximo
  },
  fileFilter: imageFilter
});

export const uploadINE = multer({
  storage: ineStorage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB máximo para INE
  },
  fileFilter: imageFilter
});

export const uploadDish = multer({
  storage: dishStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB máximo para platillos
  },
  fileFilter: imageFilter
});

export const uploadProfile = multer({
  storage: profileStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB máximo para perfil
  },
  fileFilter: imageFilter
});

// Configuración especial para restaurantes (múltiples archivos)
export const uploadRestaurantFiles = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB máximo para restaurantes (INE + múltiples imágenes)
    files: 50 // máximo 50 archivos
  },
  fileFilter: imageFilter
});

// Middleware para manejar errores de multer
export const handleMulterError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'Uno o más archivos son demasiado grandes. Máximo 50MB total permitido para restaurantes, 5MB por imagen individual.'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Demasiados archivos. Máximo 50 archivos permitidos.'
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Campo de archivo inesperado.'
      });
    }
  }
  
  if (error.message === 'Solo se permiten archivos de imagen') {
    return res.status(400).json({
      success: false,
      message: 'Solo se permiten archivos de imagen (JPG, PNG, WEBP, etc.)'
    });
  }
  
  next(error);
};