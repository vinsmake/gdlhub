/**
 * Decode JWT token payload (without verification, for client-side expiration check only)
 */
export const decodeJWT = (token) => {
  console.log('🔍 [JWT] Decodificando token...', token ? 'Token presente' : 'Token ausente');
  
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.log('❌ [JWT] Token inválido - no tiene 3 partes');
      return null;
    }
    
    const payload = parts[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    
    console.log('✅ [JWT] Token decodificado exitosamente:', {
      userId: decoded.id,
      email: decoded.email,
      issuedAt: new Date(decoded.iat * 1000).toLocaleString(),
      expiresAt: new Date(decoded.exp * 1000).toLocaleString(),
      timeUntilExpiration: Math.max(0, decoded.exp - Date.now() / 1000) + ' segundos'
    });
    
    return decoded;
  } catch (error) {
    console.error('❌ [JWT] Error decodificando JWT:', error);
    return null;
  }
};

/**
 * Check if JWT token is expired
 */
export const isTokenExpired = (token) => {
  console.log('⏰ [JWT] Verificando expiración del token...');
  
  if (!token) {
    console.log('❌ [JWT] No hay token - considerado expirado');
    return true;
  }
  
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) {
    console.log('❌ [JWT] Token no válido o sin fecha de expiración - considerado expirado');
    return true;
  }
  
  const currentTime = Date.now() / 1000; // Convert to seconds
  const isExpired = decoded.exp < currentTime;
  const timeRemaining = Math.max(0, decoded.exp - currentTime);
  
  if (isExpired) {
    console.log('🚨 [JWT] ¡TOKEN EXPIRADO! Expiró hace', Math.abs(timeRemaining), 'segundos');
  } else {
    console.log('✅ [JWT] Token válido - expira en', timeRemaining.toFixed(1), 'segundos');
  }
  
  return isExpired;
};

/**
 * Check if token will expire soon (within 5 minutes)
 */
export const isTokenExpiringSoon = (token) => {
  console.log('⚠️ [JWT] Verificando si el token expira pronto...');
  
  if (!token) {
    console.log('❌ [JWT] No hay token - considerado expirando pronto');
    return true;
  }
  
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) {
    console.log('❌ [JWT] Token no válido - considerado expirando pronto');
    return true;
  }
  
  const currentTime = Date.now() / 1000;
  const fiveMinutesFromNow = currentTime + (5 * 60); // 5 minutes in seconds
  const expiringSoon = decoded.exp < fiveMinutesFromNow;
  const timeRemaining = Math.max(0, decoded.exp - currentTime);
  
  if (expiringSoon) {
    console.log('⚠️ [JWT] Token expirará pronto! Tiempo restante:', timeRemaining.toFixed(1), 'segundos');
  } else {
    console.log('✅ [JWT] Token no expira pronto - quedan', timeRemaining.toFixed(1), 'segundos');
  }
  
  return expiringSoon;
};