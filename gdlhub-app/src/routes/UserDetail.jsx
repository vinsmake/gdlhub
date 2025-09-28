import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import AvatarUpload from "../components/AvatarUpload";
import { getAvatarUrl } from "../utils/avatarUtils";

export default function UserDetail() {
  const { uid } = useParams(); // ← para obtener el ID de la URL
  const { user, token, refreshRecommendations } = useUser();
  const navigate = useNavigate();

  const [viewedUser, setViewedUser] = useState(null);
  const [following, setFollowing] = useState(false);
  const [savedRestaurants, setSavedRestaurants] = useState([]);
  const [userFollowing, setUserFollowing] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleAvatarUpdate = (newAvatarUrl) => {
    setViewedUser(prev => prev ? { ...prev, avatar: newAvatarUrl } : null);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        // Obtener datos del usuario
        const userRes = await fetch(`${import.meta.env.VITE_API_BASE}/users/${uid}`);
        const userData = await userRes.json();
        setViewedUser(userData);

        // Obtener restaurantes guardados
        const savedRes = await fetch(`${import.meta.env.VITE_API_BASE}/users/${uid}/saved-restaurants`);
        const savedData = await savedRes.json();
        setSavedRestaurants(savedData);

        // Obtener personas seguidas
        const followingRes = await fetch(`${import.meta.env.VITE_API_BASE}/users/${uid}/following`);
        const followingData = await followingRes.json();
        setUserFollowing(followingData);

      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [uid]);

  useEffect(() => {
    if (!user || !token) return;

    fetch(`${import.meta.env.VITE_API_BASE}/users/${uid}/follow`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) return;
        return res.json();
      })
      .then(data => {
        if (data?.following) setFollowing(true);
      })
      .catch(() => {});
  }, [uid, user, token]);

  const handleClick = () => {
    if (!user || !token) {
      navigate("/login");
      return;
    }

    fetch(`${import.meta.env.VITE_API_BASE}/users/${uid}/follow`, {
      method: following ? "DELETE" : "POST",
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(() => {
      setFollowing(!following);
      refreshRecommendations(); // Actualizar recomendaciones cuando cambia el follow status
    });
  };

  if (loading) {
    return (
      <div className="text-white flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent"></div>
      </div>
    );
  }

  if (!viewedUser) return null;

  const isOwnProfile = user?.id === viewedUser.id;

  return (
    <div className="text-white space-y-6">
      {/* Información del perfil */}
      <div className="bg-neutral-800 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">{viewedUser.name}</h2>
        <p className="text-gray-400 mb-4">Email: {viewedUser.email}</p>
        
        {isOwnProfile ? (
          <div>
            <h3 className="text-lg font-semibold mb-3">Foto de Perfil</h3>
            <AvatarUpload 
              currentUser={viewedUser} 
              onAvatarUpdate={handleAvatarUpdate}
            />
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <img
              src={getAvatarUrl(viewedUser.avatar)}
              alt={viewedUser.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <button
              onClick={handleClick}
              className={`px-4 py-2 rounded font-semibold transition ${
                following
                  ? "bg-gray-600 hover:bg-gray-500"
                  : "bg-red-600 hover:bg-red-500"
              }`}
            >
              {following ? "Dejar de seguir" : "Seguir"}
            </button>
          </div>
        )}
      </div>

      {/* Restaurantes guardados */}
      <div className="bg-neutral-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">
          🍽️ Restaurantes Guardados ({savedRestaurants.length})
        </h3>
        {savedRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedRestaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                onClick={() => navigate(`/restaurants/${restaurant.id}`)}
                className="bg-neutral-700 rounded-lg p-4 cursor-pointer hover:bg-neutral-600 transition-colors"
              >
                <img
                  src={`${import.meta.env.VITE_API_BASE}/img/restaurant/${restaurant.image}`}
                  alt={restaurant.name}
                  className="w-full h-32 object-cover rounded mb-3"
                />
                <h4 className="font-semibold">{restaurant.name}</h4>
                <p className="text-sm text-gray-400 line-clamp-2">{restaurant.description}</p>
                {restaurant.avg_rating && (
                  <div className="flex items-center mt-2">
                    <span className="text-yellow-400">⭐</span>
                    <span className="ml-1 text-sm">{restaurant.avg_rating} ({restaurant.total_ratings} reseñas)</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No ha guardado restaurantes aún</p>
        )}
      </div>

      {/* Personas seguidas */}
      <div className="bg-neutral-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">
          👥 Siguiendo ({userFollowing.length})
        </h3>
        {userFollowing.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userFollowing.map((followedUser) => (
              <div
                key={followedUser.id}
                onClick={() => navigate(`/users/${followedUser.id}`)}
                className="bg-neutral-700 rounded-lg p-4 cursor-pointer hover:bg-neutral-600 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={getAvatarUrl(followedUser.avatar)}
                    alt={followedUser.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold">{followedUser.name}</h4>
                    <p className="text-sm text-gray-400">{followedUser.email}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">{isOwnProfile ? "No sigues a nadie aún" : "No sigue a nadie"}</p>
        )}
      </div>
    </div>
  );
}
