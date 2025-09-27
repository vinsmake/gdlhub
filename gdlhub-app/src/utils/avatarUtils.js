// Función helper para obtener la URL correcta del avatar
export const getAvatarUrl = (avatar) => {
  const baseUrl = import.meta.env.VITE_API_BASE;
  
  if (!avatar) {
    // Avatar por defecto si no hay avatar
    return `${baseUrl}/img/user/pc1.jpg`;
  }
  
  if (avatar.startsWith('/uploads/')) {
    // Nueva imagen subida por el usuario
    return `${baseUrl}${avatar}`;
  }
  
  // Imagen estática antigua (pc1.jpg, pc2.jpg, etc.)
  return `${baseUrl}/img/user/${avatar}`;
};