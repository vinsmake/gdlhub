import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { getProfileImageUrl } from "../utils/avatarUtils";

export default function ConfigPage() {
  const { user, token, updateUser } = useUser();
  const navigate = useNavigate();
  
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    bio: "",
    location: ""
  });
  
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!user || !token) {
      navigate("/login");
    } else {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        bio: user.bio || "",
        location: user.location || ""
      });
      
      // Establecer preview de imagen usando la función helper
      setImagePreview(getProfileImageUrl(user));
    }
  }, [user, token, navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      
      // Crear preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append("name", profileData.name);
      formData.append("email", profileData.email);
      formData.append("bio", profileData.bio);
      formData.append("location", profileData.location);
      
      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      const res = await fetch(`${import.meta.env.VITE_API_BASE}/users/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error al actualizar perfil");
      }

      // Actualizar contexto de usuario
      updateUser(data.user);
      setSuccess(true);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user || !token) {
    return <div className="text-white text-center p-6">Redirigiendo...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-neutral-800 p-6 rounded-2xl text-white shadow-lg mt-10">
      <h1 className="text-3xl font-bold mb-6 text-center">⚙️ Configuración</h1>
      
      {/* Sección de perfil */}
      <div className="mb-8 p-6 bg-neutral-700 rounded-xl">
        <h2 className="text-2xl font-semibold mb-4">👤 Mi Perfil</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Imagen de perfil */}
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-neutral-600">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl">
                  👤
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Foto de perfil</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-600 file:text-white hover:file:bg-red-500"
              />
            </div>
          </div>

          {/* Campos del perfil */}
          <div>
            <label className="block text-sm font-medium mb-1">Nombre</label>
            <input
              type="text"
              name="name"
              value={profileData.name}
              onChange={handleInputChange}
              className="w-full p-3 rounded bg-neutral-600 border border-neutral-500 focus:border-red-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={profileData.email}
              readOnly
              className="w-full p-3 rounded bg-neutral-700 border border-neutral-500 text-gray-400 cursor-not-allowed"
              title="El email no se puede modificar"
            />
            <p className="text-xs text-gray-400 mt-1">El email no se puede modificar por seguridad</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Biografía</label>
            <textarea
              name="bio"
              value={profileData.bio}
              onChange={handleInputChange}
              placeholder="Cuéntanos algo sobre ti..."
              rows={3}
              className="w-full p-3 rounded bg-neutral-600 border border-neutral-500 focus:border-red-500 focus:outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Ubicación</label>
            <input
              type="text"
              name="location"
              value={profileData.location}
              onChange={handleInputChange}
              placeholder="Ciudad, Estado"
              className="w-full p-3 rounded bg-neutral-600 border border-neutral-500 focus:border-red-500 focus:outline-none"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-600/20 border border-red-500 rounded text-red-400">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-600/20 border border-green-500 rounded text-green-400">
              Perfil actualizado correctamente
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-500 disabled:bg-gray-600 px-6 py-3 rounded text-white font-semibold transition"
          >
            {loading ? "Guardando..." : "Guardar cambios"}
          </button>
        </form>
      </div>

      {/* Sección de restaurante */}
      <div className="p-6 bg-neutral-700 rounded-xl">
        <h2 className="text-2xl font-semibold mb-4">🍽️ Mi Restaurante</h2>
        <p className="text-gray-300 mb-4">
          ¿Tienes un restaurante? Regístralo en nuestra plataforma y comparte tu menú con la comunidad.
        </p>
        
        <button
          onClick={() => navigate("/restaurants/new")}
          className="w-full bg-green-600 hover:bg-green-500 px-6 py-3 rounded text-white font-semibold transition flex items-center justify-center space-x-2"
        >
          <span>🏪</span>
          <span>Registrar mi restaurante</span>
        </button>
        
        <div className="mt-4 p-4 bg-yellow-600/20 border border-yellow-500 rounded">
          <p className="text-yellow-400 text-sm">
            <strong>Nota importante:</strong> Para registrar un restaurante necesitarás subir una copia de tu INE como verificación. 
            Los restaurantes falsos serán eliminados sin previo aviso.
          </p>
        </div>
      </div>
    </div>
  );
}