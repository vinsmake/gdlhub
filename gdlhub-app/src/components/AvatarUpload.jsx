import { useState } from "react";
import { useUser } from "../context/UserContext";
import { getAvatarUrl } from "../utils/avatarUtils";

export default function AvatarUpload({ currentUser, onAvatarUpdate }) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { token, updateUser } = useUser();

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      setError('Solo se permiten archivos de imagen');
      return;
    }

    // Validar tamaño (5MB máximo)
    if (file.size > 5 * 1024 * 1024) {
      setError('El archivo es demasiado grande. Máximo 5MB permitido.');
      return;
    }

    setIsUploading(true);
    setError(null);
    setSuccess(false);

    try {
      console.log('📷 [AVATAR] Subiendo nueva foto de perfil...');
      
      const formData = new FormData();
      formData.append('avatar', file);
      formData.append('userId', currentUser.id);

      const res = await fetch(`${import.meta.env.VITE_API_BASE}/upload-avatar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Error subiendo imagen');
      }

      console.log('✅ [AVATAR] Foto actualizada exitosamente');
      
      // Actualizar el contexto del usuario con la nueva foto
      if (updateUser) {
        updateUser({ ...currentUser, avatar: data.avatarUrl });
      }
      
      // Notificar al componente padre
      if (onAvatarUpdate) {
        onAvatarUpdate(data.avatarUrl);
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);

    } catch (error) {
      console.error('❌ [AVATAR] Error:', error);
      setError(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <img
            src={getAvatarUrl(currentUser.avatar)}
            alt={currentUser.name}
            className="w-20 h-20 rounded-full object-cover border-2 border-gray-600"
          />
          {isUploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <label className="block">
            <span className="sr-only">Cambiar foto de perfil</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              disabled={isUploading}
              className="block w-full text-sm text-gray-400
                        file:mr-4 file:py-2 file:px-4
                        file:rounded file:border-0
                        file:text-sm file:font-semibold
                        file:bg-red-600 file:text-white
                        hover:file:bg-red-500
                        file:disabled:bg-red-800
                        file:disabled:cursor-not-allowed"
            />
          </label>
          <p className="text-xs text-gray-500 mt-1">
            PNG, JPG, GIF hasta 5MB
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-600/20 border border-red-600 text-red-300 p-3 rounded text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-600/20 border border-green-600 text-green-300 p-3 rounded text-sm">
          ✅ Foto de perfil actualizada exitosamente
        </div>
      )}
    </div>
  );
}