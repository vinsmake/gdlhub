import { isTokenExpired } from './tokenUtils.js';

export const fetchAuth = async (url, options = {}) => {
  console.log('🌐 [FETCH_AUTH] Iniciando request autenticado a:', url);
  
  const token = localStorage.getItem("token");
  console.log('🔑 [FETCH_AUTH] Token obtenido del localStorage:', token ? 'Token presente' : 'Token ausente');
  
  // Check if token is expired before making the request
  console.log('🔍 [FETCH_AUTH] Verificando expiración antes del request...');
  if (isTokenExpired(token)) {
    console.log('🚨 [FETCH_AUTH] ¡TOKEN EXPIRADO! Iniciando logout automático...');
    
    // Show user-friendly message
    alert("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
    
    // Clear localStorage and dispatch logout event
    console.log('🧹 [FETCH_AUTH] Limpiando localStorage...');
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    
    // Dispatch a custom event to notify UserContext about logout
    console.log('📢 [FETCH_AUTH] Enviando evento tokenExpired...');
    window.dispatchEvent(new CustomEvent("tokenExpired"));
    
    // Redirect to login page
    console.log('↩️ [FETCH_AUTH] Redirigiendo a /login...');
    window.location.href = "/login";
    
    // Return a rejected promise to prevent further execution
    return Promise.reject(new Error("Token expired"));
  }
  
  console.log('✅ [FETCH_AUTH] Token válido, procediendo con el request...');
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  console.log('📡 [FETCH_AUTH] Respuesta recibida:', {
    status: response.status,
    statusText: response.statusText,
    url: url
  });

  // Check if token has expired (403 or 401 status from server)
  if (response.status === 403 || response.status === 401) {
    console.log('⚠️ [FETCH_AUTH] Respuesta de error de autenticación detectada (403/401)');
    
    const responseData = await response.json().catch(() => ({}));
    console.log('📄 [FETCH_AUTH] Datos de respuesta:', responseData);
    
    // Check if it's specifically a token expiration error
    if (responseData.message?.includes("expirado") || responseData.message?.includes("inválido")) {
      console.log('🚨 [FETCH_AUTH] ¡ERROR DE TOKEN CONFIRMADO POR SERVIDOR! Mensaje:', responseData.message);
      
      // Show user-friendly message
      alert("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
      
      // Clear localStorage and dispatch logout event
      console.log('🧹 [FETCH_AUTH] Limpiando localStorage después de error del servidor...');
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      
      // Dispatch a custom event to notify UserContext about logout
      console.log('📢 [FETCH_AUTH] Enviando evento tokenExpired después de error del servidor...');
      window.dispatchEvent(new CustomEvent("tokenExpired"));
      
      // Redirect to login page
      console.log('↩️ [FETCH_AUTH] Redirigiendo a /login después de error del servidor...');
      window.location.href = "/login";
    } else {
      console.log('ℹ️ [FETCH_AUTH] Error de autenticación pero no relacionado con expiración de token');
    }
  } else {
    console.log('✅ [FETCH_AUTH] Request completado exitosamente');
  }

  return response;
};
