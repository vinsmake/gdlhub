// Función helper para obtener la URL correcta del avatar
export const getAvatarUrl = (avatar) => {
  const baseUrl = import.meta.env.VITE_API_BASE;
  
  if (!avatar) {
    // Avatar por defecto si no hay avatar
    return `${baseUrl}/img/user/pc1.jpg`;
  }
  
  if (avatar.startsWith('/uploads/') || avatar.startsWith('uploads/')) {
    // Nueva imagen subida por el usuario
    return avatar.startsWith('/') ? `${baseUrl}${avatar}` : `${baseUrl}/${avatar}`;
  }
  
  // Imagen estática antigua (pc1.jpg, pc2.jpg, etc.)
  return `${baseUrl}/img/user/${avatar}`;
};

// Función específica para obtener imagen de perfil
export const getProfileImageUrl = (user) => {
  const baseUrl = import.meta.env.VITE_API_BASE;
  
  // Prioridad: profile_image > avatar > default
  if (user?.profile_image) {
    return user.profile_image.startsWith('/') ? `${baseUrl}${user.profile_image}` : `${baseUrl}/${user.profile_image}`;
  }
  
  if (user?.avatar) {
    return getAvatarUrl(user.avatar);
  }
  
  return `${baseUrl}/img/user/pc1.jpg`;
};