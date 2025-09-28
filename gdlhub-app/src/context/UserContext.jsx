import { createContext, useContext, useEffect, useState } from "react";
import { isTokenExpired } from "../utils/tokenUtils.js";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [recommendationsUpdateCounter, setRecommendationsUpdateCounter] = useState(0);

  useEffect(() => {
    console.log('🔄 [USER_CONTEXT] Inicializando UserContext...');
    
    try {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      console.log('📦 [USER_CONTEXT] Datos del localStorage:', {
        hasUser: !!storedUser,
        hasToken: !!storedToken
      });

      if (storedUser && storedToken) {
        console.log('🔍 [USER_CONTEXT] Verificando token almacenado...');
        
        // Check if the stored token is expired
        if (isTokenExpired(storedToken)) {
          console.log('🚨 [USER_CONTEXT] Token almacenado expirado! Limpiando...');
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          return;
        }

        console.log('✅ [USER_CONTEXT] Token almacenado válido, restaurando sesión...');
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && typeof parsedUser === "object") {
          console.log('👤 [USER_CONTEXT] Usuario restaurado:', parsedUser.email);
          setUser(parsedUser);
          setToken(storedToken);
        } else {
          console.log('❌ [USER_CONTEXT] Datos de usuario inválidos, limpiando...');
          localStorage.removeItem("user");
          localStorage.removeItem("token");
        }
      } else {
        console.log('ℹ️ [USER_CONTEXT] No hay datos de sesión almacenados');
      }
    } catch (err) {
      console.error("❌ [USER_CONTEXT] Error leyendo localStorage:", err);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }

    // Listen for token expiration events
    const handleTokenExpired = () => {
      console.log('📢 [USER_CONTEXT] ¡Evento tokenExpired recibido! Cerrando sesión...');
      setUser(null);
      setToken(null);
    };

    console.log('👂 [USER_CONTEXT] Configurando listener para eventos tokenExpired...');
    window.addEventListener("tokenExpired", handleTokenExpired);

    // Set up periodic token expiration check (every minute)
    const checkTokenExpiration = () => {
      console.log('⏰ [USER_CONTEXT] Ejecutando verificación periódica de token...');
      const currentToken = localStorage.getItem("token");
      
      if (currentToken) {
        console.log('🔍 [USER_CONTEXT] Token encontrado, verificando expiración...');
        if (isTokenExpired(currentToken)) {
          console.log('🚨 [USER_CONTEXT] ¡Token expirado detectado en verificación periódica!');
          handleTokenExpired();
          localStorage.removeItem("user");
          localStorage.removeItem("token");
        } else {
          console.log('✅ [USER_CONTEXT] Token sigue válido en verificación periódica');
        }
      } else {
        console.log('ℹ️ [USER_CONTEXT] No hay token en verificación periódica');
      }
    };

    console.log('⏰ [USER_CONTEXT] Configurando verificación periódica cada 5 segundos (para testing)...');
    const tokenCheckInterval = setInterval(checkTokenExpiration, 5000); // Check every 5 seconds for testing

    // Cleanup event listener and interval on component unmount
    return () => {
      console.log('🧹 [USER_CONTEXT] Limpiando listeners y intervalos...');
      window.removeEventListener("tokenExpired", handleTokenExpired);
      clearInterval(tokenCheckInterval);
    };
  }, []);

  const login = (user, token) => {
    console.log('🔐 [USER_CONTEXT] Iniciando sesión para usuario:', user.email);
    console.log('🔑 [USER_CONTEXT] Token recibido, validando...');
    
    // Verificar que el token sea válido
    if (isTokenExpired(token)) {
      console.log('❌ [USER_CONTEXT] ¡ADVERTENCIA! Token recibido ya está expirado');
    } else {
      console.log('✅ [USER_CONTEXT] Token válido recibido');
    }
    
    setUser(user);
    setToken(token);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    
    console.log('💾 [USER_CONTEXT] Sesión guardada en localStorage');
  };

  const logout = () => {
    console.log('🚪 [USER_CONTEXT] Cerrando sesión...');
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    console.log('🧹 [USER_CONTEXT] Sesión limpiada del localStorage');
  };

  const updateUser = (updatedUser) => {
    console.log('👤 [USER_CONTEXT] Actualizando datos del usuario...');
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    console.log('💾 [USER_CONTEXT] Usuario actualizado en localStorage');
  };

  const refreshRecommendations = () => {
    console.log('🔄 [USER_CONTEXT] Forzando actualización de recomendaciones...');
    setRecommendationsUpdateCounter(prev => prev + 1);
  };

  return (
    <UserContext.Provider value={{ user, token, login, logout, updateUser, recommendationsUpdateCounter, refreshRecommendations }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
