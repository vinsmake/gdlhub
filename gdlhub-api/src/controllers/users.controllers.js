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
      WITH user_saved_restaurants AS (
        SELECT restaurant_id 
        FROM favorite_restaurants 
        WHERE user_id = $1
      ),
      user_rated_restaurants AS (
        SELECT restaurant_id 
        FROM restaurant_ratings 
        WHERE user_id = $1
      ),
      followed_users_favorites AS (
        -- Restaurantes favoritos de usuarios que sigo
        SELECT 
          r.id as restaurant_id,
          r.name,
          r.image,
          COUNT(fr.user_id) as popularity_score,
          'followed_favorites' as source,
          ARRAY_AGG(DISTINCT u.name) as recommended_by
        FROM user_follows uf
        JOIN favorite_restaurants fr ON uf.followed_id = fr.user_id
        JOIN restaurants r ON fr.restaurant_id = r.id
        JOIN users u ON fr.user_id = u.id
        WHERE uf.follower_id = $1
          AND r.id NOT IN (SELECT restaurant_id FROM user_saved_restaurants)
          AND r.id NOT IN (SELECT restaurant_id FROM user_rated_restaurants)
        GROUP BY r.id, r.name, r.image
      ),
      similar_restaurants AS (
        -- Restaurantes con especialidades similares a mis favoritos
        SELECT 
          r.id as restaurant_id,
          r.name,
          r.image,
          COUNT(DISTINCT s.name) as specialty_match_score,
          'similar_specialties' as source,
          ARRAY_AGG(DISTINCT s.name) as matched_specialties
        FROM restaurants r
        JOIN specialties s ON r.id = s.restaurant_id
        WHERE s.name IN (
          SELECT DISTINCT s2.name 
          FROM user_saved_restaurants usr
          JOIN specialties s2 ON usr.restaurant_id = s2.restaurant_id
        )
        AND r.id NOT IN (SELECT restaurant_id FROM user_saved_restaurants)
        AND r.id NOT IN (SELECT restaurant_id FROM user_rated_restaurants)
        GROUP BY r.id, r.name, r.image
        HAVING COUNT(DISTINCT s.name) >= 1
      ),
      top_rated_by_followed AS (
        -- Restaurantes mejor calificados por usuarios que sigo
        SELECT 
          r.id as restaurant_id,
          r.name,
          r.image,
          ROUND(AVG(rt.rating), 1) as avg_rating_by_followed,
          COUNT(rt.rating) as rating_count,
          'top_rated_by_followed' as source,
          ARRAY_AGG(DISTINCT u.name) as rated_by
        FROM user_follows uf
        JOIN restaurant_ratings rt ON uf.followed_id = rt.user_id
        JOIN restaurants r ON rt.restaurant_id = r.id
        JOIN users u ON rt.user_id = u.id
        WHERE uf.follower_id = $1
          AND rt.rating >= 4.0
          AND r.id NOT IN (SELECT restaurant_id FROM user_saved_restaurants)
          AND r.id NOT IN (SELECT restaurant_id FROM user_rated_restaurants)
        GROUP BY r.id, r.name, r.image
        HAVING AVG(rt.rating) >= 4.0
      )
      
      SELECT 
        restaurant_id,
        name,
        image,
        source,
        COALESCE(popularity_score, 0) + 
        COALESCE(specialty_match_score, 0) * 2 + 
        COALESCE(ROUND(avg_rating_by_followed * rating_count), 0) as total_score,
        COALESCE(recommended_by, rated_by, matched_specialties::text[]) as similar_users,
        COALESCE(avg_rating_by_followed, 0) as avg_rating,
        (
          SELECT COALESCE(json_agg(s.name), '[]')
          FROM specialties s
          WHERE s.restaurant_id = main.restaurant_id
        ) as specialties
      FROM (
        SELECT restaurant_id, name, image, popularity_score, NULL::integer as specialty_match_score, 
               NULL::numeric as avg_rating_by_followed, NULL::bigint as rating_count, source, recommended_by, 
               NULL::text[] as rated_by, NULL::text[] as matched_specialties
        FROM followed_users_favorites
        
        UNION ALL
        
        SELECT restaurant_id, name, image, NULL::bigint as popularity_score, specialty_match_score,
               NULL::numeric as avg_rating_by_followed, NULL::bigint as rating_count, source, 
               NULL::text[] as recommended_by, NULL::text[] as rated_by, matched_specialties
        FROM similar_restaurants
        
        UNION ALL
        
        SELECT restaurant_id, name, image, NULL::bigint as popularity_score, NULL::integer as specialty_match_score,
               avg_rating_by_followed, rating_count, source, NULL::text[] as recommended_by, 
               rated_by, NULL::text[] as matched_specialties
        FROM top_rated_by_followed
      ) main
      ORDER BY total_score DESC, source = 'followed_favorites' DESC
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
    
    // Actualizar la base de datos con la ruta del avatar en el campo profile_image
    const { rows } = await pool.query(
      'UPDATE users SET profile_image = $1 WHERE id = $2 RETURNING id, name, email, avatar, profile_image',
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
      avatarUrl: avatarPath,
      profileImage: avatarPath
    });

  } catch (error) {
    console.error('❌ [AVATAR] Error subiendo avatar:', error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
};

// Obtener restaurantes guardados de un usuario
export const getUserSavedRestaurants = async (req, res) => {
  try {
    const { uid } = req.params;
    
    const { rows } = await pool.query(`
      SELECT 
        r.id, 
        r.name, 
        r.image, 
        r.description,
        COALESCE(ROUND(AVG(rt.rating), 1), 0) as avg_rating,
        COUNT(rt.rating) as total_ratings
      FROM favorite_restaurants fr
      JOIN restaurants r ON fr.restaurant_id = r.id
      LEFT JOIN restaurant_ratings rt ON r.id = rt.restaurant_id
      WHERE fr.user_id = $1
      GROUP BY r.id, r.name, r.image, r.description, fr.created_at
      ORDER BY fr.created_at DESC
    `, [uid]);
    
    res.json(rows);
  } catch (error) {
    console.error('❌ [SAVED_RESTAURANTS] Error:', error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Obtener personas seguidas por un usuario
export const getUserFollowing = async (req, res) => {
  try {
    const { uid } = req.params;
    
    const { rows } = await pool.query(`
      SELECT 
        u.id, 
        u.name, 
        u.email,
        u.avatar
      FROM user_follows uf
      JOIN users u ON uf.followed_id = u.id
      WHERE uf.follower_id = $1
      ORDER BY uf.created_at DESC
    `, [uid]);
    
    res.json(rows);
  } catch (error) {
    console.error('❌ [USER_FOLLOWING] Error:', error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Actualizar perfil de usuario
export const updateProfile = async (req, res) => {
  const userId = req.user?.id;
  
  if (!userId) {
    return res.status(401).json({ message: "No autenticado" });
  }

  try {
    console.log('📝 [UPDATE_PROFILE] Body:', req.body);
    console.log('📁 [UPDATE_PROFILE] File:', req.file);
    
    const { name, email, bio, location } = req.body;
    let profileImagePath = null;

    // Procesar imagen de perfil si se subió
    if (req.file) {
      profileImagePath = `uploads/profiles/${req.file.filename}`;
    }

    // Construir query dinámicamente
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (name) {
      updates.push(`name = $${paramCount++}`);
      values.push(name);
    }
    if (email) {
      updates.push(`email = $${paramCount++}`);
      values.push(email);
    }
    if (bio !== undefined) {
      updates.push(`bio = $${paramCount++}`);
      values.push(bio);
    }
    if (location !== undefined) {
      updates.push(`location = $${paramCount++}`);
      values.push(location);
    }
    if (profileImagePath) {
      updates.push(`profile_image = $${paramCount++}`);
      values.push(profileImagePath);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: "No hay campos para actualizar" });
    }

    values.push(userId);
    const query = `
      UPDATE users 
      SET ${updates.join(', ')} 
      WHERE id = $${paramCount} 
      RETURNING id, name, email, bio, location, profile_image, avatar, created_at
    `;

    const { rows } = await pool.query(query, values);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({ 
      message: "Perfil actualizado correctamente",
      user: rows[0]
    });

  } catch (error) {
    console.error('❌ [UPDATE_PROFILE] Error:', error);
    
    if (error.code === '23505') {
      return res.status(409).json({ message: "Email ya está en uso" });
    }
    
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

