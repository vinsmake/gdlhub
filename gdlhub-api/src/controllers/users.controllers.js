import { pool } from "../db.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateToken.js";
import { sendVerificationEmail, generateVerificationCode } from "../services/emailService.js";


export const getUsers = async (req, res) => {
    const { rows } = await pool.query("SELECT * FROM users")
    res.json(rows);
}

export const getUserById = async (req, res) => {
    const { uid } = req.params;
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [uid]);
    if (rows.length === 0) {
        return res.status(404).json({ message: "User not found" });
    }
    res.json(rows[0]);
}

export const createUser = async (req, res) => {
  try {
    const { name, email, password, avatar } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ message: "La contraseña debe tener al menos 6 caracteres." });
    }

    const hash = await bcrypt.hash(password, 10);

    const { rows } = await pool.query(
      `INSERT INTO users (name, email, password_hash, avatar) VALUES ($1, $2, $3, $4) RETURNING id, name, email, avatar`,
      [name, email, hash, avatar]
    );

    const user = rows[0];

    // Si es una solicitud de registro (viene del endpoint /register), devolver token también
    if (req.path === '/register') {
      console.log('🔐 [REGISTER] Generando token para auto-login...');
      const token = generateToken(user);
      res.status(201).json({ user, token });
    } else {
      // Creación normal de usuario (endpoint /users)
      res.status(201).json(user);
    }
    
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ message: "Email ya registrado" });
    }
    console.error('❌ [CREATE_USER] Error:', error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const deleteUser = async (req, res) => {
    const { uid } = req.params;
    const { rowCount } = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [uid]);

    if (rowCount === 0) {
        return res.status(404).json({ message: "User not found" });
    }

    return res.sendStatus(204);
}

export const updateUser = async (req, res) => {
    const { uid } = req.params;
    const data = req.body;
    const result = await pool.query('UPDATE users SET name = $1, email = $2 WHERE id = $3', [data.name, data.email, uid]);
    res.send("actualizando usuario con id: " + uid);
}

export const getUserRecommendations = async (req, res) => {
  const { uid } = req.params;

  try {
    const { rows } = await pool.query(
      `
SELECT 
  r2.restaurant_id,
  res.name,
  res.image,
  ROUND(AVG(r2.rating), 1) AS avg_rating,
  COUNT(DISTINCT r_common.user_id) AS similar_votes,
  ARRAY_AGG(DISTINCT u.name) AS similar_users,
  MIN(res_common.name) AS common_restaurant,
  (
    SELECT COALESCE(json_agg(s.name), '[]')
    FROM specialties s
    WHERE s.restaurant_id = res.id
  ) AS specialties
FROM restaurant_ratings r1
JOIN restaurant_ratings r_common ON r1.user_id <> r_common.user_id
  AND r1.restaurant_id = r_common.restaurant_id
JOIN restaurant_ratings r2 ON r_common.user_id = r2.user_id
JOIN restaurants res ON res.id = r2.restaurant_id
JOIN restaurants res_common ON res_common.id = r_common.restaurant_id
JOIN users u ON u.id = r_common.user_id
WHERE r1.user_id = $1
  AND r2.restaurant_id NOT IN (
    SELECT restaurant_id FROM restaurant_ratings WHERE user_id = $1
  )
GROUP BY r2.restaurant_id, res.id
ORDER BY avg_rating DESC, similar_votes DESC
LIMIT 10;
      `,
      [uid]
    );

    res.json(rows);
  } catch (err) {
    console.error("Error in recommendation query:", err.message);
    res.status(500).json({ message: err.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { rows } = await pool.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);

    if (!valid) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    const token = generateToken(user); // ← genera JWT

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    console.error("Error al hacer login:", err);
    res.status(500).json({ message: "Error interno" });
  }
};

// Nuevo controlador para registro con verificación por email
export const registerUser = async (req, res) => {
  try {
    console.log('📝 [REGISTER] Iniciando proceso de registro...');
    const { name, email, password } = req.body;

    // Validaciones
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Todos los campos son requeridos" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "La contraseña debe tener al menos 6 caracteres" });
    }

    // Verificar si el email ya existe
    const existingUser = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ message: "Email ya registrado" });
    }

    // Generar código de verificación
    const verificationCode = generateVerificationCode();
    console.log('🔢 [REGISTER] Código de verificación generado:', verificationCode);

    // Hashear la contraseña
    const passwordHash = await bcrypt.hash(password, 10);

    // Manejar avatar si se subió
    let avatarPath = null;
    if (req.file) {
      avatarPath = `/uploads/avatars/${req.file.filename}`;
      console.log('📷 [REGISTER] Avatar subido:', avatarPath);
    }

    // Guardar datos temporalmente en tabla de verificaciones
    const userData = {
      name,
      email,
      password_hash: passwordHash,
      avatar: avatarPath
    };

    // Limpiar verificaciones anteriores para este email
    await pool.query(
      "DELETE FROM email_verifications WHERE email = $1",
      [email]
    );

    // Insertar nueva verificación
    await pool.query(
      `INSERT INTO email_verifications (email, verification_code, user_data, expires_at) 
       VALUES ($1, $2, $3, NOW() + INTERVAL '15 minutes')`,
      [email, verificationCode, JSON.stringify(userData)]
    );

    // Enviar email
    console.log('📧 [REGISTER] Enviando email de verificación...');
    const emailResult = await sendVerificationEmail(email, verificationCode, name);

    console.log('✅ [REGISTER] Proceso iniciado exitosamente');
    
    res.status(200).json({
      message: "Código de verificación enviado a tu email",
      email: email,
      previewUrl: emailResult.previewUrl // Solo para testing
    });

  } catch (error) {
    console.error('❌ [REGISTER] Error en registro:', error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Controlador para verificar código y completar registro
export const verifyEmailAndRegister = async (req, res) => {
  try {
    console.log('🔍 [VERIFY] Verificando código...');
    const { email, verificationCode } = req.body;

    if (!email || !verificationCode) {
      return res.status(400).json({ message: "Email y código son requeridos" });
    }

    // Buscar verificación válida
    const verificationResult = await pool.query(
      `SELECT * FROM email_verifications 
       WHERE email = $1 AND verification_code = $2 
       AND verified = FALSE AND expires_at > NOW()`,
      [email, verificationCode]
    );

    if (verificationResult.rows.length === 0) {
      console.log('❌ [VERIFY] Código inválido o expirado');
      return res.status(400).json({ message: "Código inválido o expirado" });
    }

    const verification = verificationResult.rows[0];
    const userData = verification.user_data;

    console.log('✅ [VERIFY] Código válido, creando usuario...');

    // Crear usuario en la base de datos
    const { rows } = await pool.query(
      `INSERT INTO users (name, email, password_hash, avatar, email_verified) 
       VALUES ($1, $2, $3, $4, TRUE) RETURNING id, name, email, avatar`,
      [userData.name, userData.email, userData.password_hash, userData.avatar]
    );

    const user = rows[0];

    // Marcar verificación como completada
    await pool.query(
      "UPDATE email_verifications SET verified = TRUE WHERE id = $1",
      [verification.id]
    );

    // Generar token para auto-login
    const token = generateToken(user);

    console.log('🎉 [VERIFY] Usuario creado y verificado exitosamente');

    res.status(201).json({
      message: "Cuenta creada exitosamente",
      user,
      token
    });

  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ message: "Email ya registrado" });
    }
    console.error('❌ [VERIFY] Error en verificación:', error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Subir avatar de usuario
export const uploadUserAvatar = async (req, res) => {
  try {
    console.log("📷 [AVATAR] Iniciando subida de avatar...");
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No se proporcionó ningún archivo de imagen"
      });
    }

    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "ID de usuario requerido"
      });
    }

    const avatarPath = `/uploads/avatars/${req.file.filename}`;
    
    // Actualizar la base de datos con la ruta del avatar
    const { rows } = await pool.query(
      'UPDATE users SET avatar = $1 WHERE id = $2 RETURNING id, name, email, avatar',
      [avatarPath, userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado"
      });
    }

    console.log("✅ [AVATAR] Avatar subido exitosamente:", avatarPath);
    
    res.json({
      success: true,
      message: "Avatar subido exitosamente",
      user: rows[0],
      avatarUrl: avatarPath
    });

  } catch (error) {
    console.error('❌ [AVATAR] Error subiendo avatar:', error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
};

