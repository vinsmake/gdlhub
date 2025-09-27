-- Tabla para códigos de verificación de email
CREATE TABLE IF NOT EXISTS email_verifications (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  verification_code VARCHAR(6) NOT NULL,
  user_data JSONB NOT NULL, -- Almacena temporalmente los datos del usuario
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL '15 minutes'),
  verified BOOLEAN DEFAULT FALSE
);

-- Agregar campo de verificación de email a usuarios
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE;

-- Índice para búsqueda rápida por email y código
CREATE INDEX IF NOT EXISTS idx_email_verification_email_code 
ON email_verifications(email, verification_code);

-- Índice para limpieza automática de códigos expirados
CREATE INDEX IF NOT EXISTS idx_email_verification_expires_at 
ON email_verifications(expires_at);