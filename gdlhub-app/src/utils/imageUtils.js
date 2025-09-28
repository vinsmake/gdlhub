// Función helper para obtener la URL correcta de imagen de restaurante
export const getRestaurantImageUrl = (image) => {
  const baseUrl = import.meta.env.VITE_API_BASE;
  
  if (!image) {
    return null;
  }
  
  if (image.startsWith('/uploads/') || image.startsWith('uploads/')) {
    // Nueva imagen subida por el usuario
    return image.startsWith('/') ? `${baseUrl}${image}` : `${baseUrl}/${image}`;
  }
  
  // Imagen estática antigua (rest1.jpg, rest2.jpg, etc.)
  return `${baseUrl}/img/restaurant/${image}`;
};

// Función helper para obtener la URL correcta de imagen de platillo
export const getDishImageUrl = (image) => {
  const baseUrl = import.meta.env.VITE_API_BASE;
  
  if (!image) {
    return null;
  }
  
  // Si ya incluye uploads/ (nueva imagen), usar directamente
  if (image.startsWith('/uploads/') || image.startsWith('uploads/')) {
    return image.startsWith('/') ? `${baseUrl}${image}` : `${baseUrl}/${image}`;
  }
  
  // Para backwards compatibility con imágenes legacy
  return `${baseUrl}/img/dishes/${image}`;
};