import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import AvatarUpload from "../components/AvatarUpload";

export default function UserDetail() {
  const { uid } = useParams(); // ← para obtener el ID de la URL
  const { user, token } = useUser();
  const navigate = useNavigate();

  const [viewedUser, setViewedUser] = useState(null);
  const [following, setFollowing] = useState(false);

  const handleAvatarUpdate = (newAvatarUrl) => {
    setViewedUser(prev => prev ? { ...prev, avatar: newAvatarUrl } : null);
  };

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE}/users/${uid}`)
      .then(res => res.json())
      .then(setViewedUser);
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
    }).then(() => setFollowing(!following));
  };

  if (!viewedUser) return null;

  const isOwnProfile = user?.id === viewedUser.id;

  return (
    <div className="text-white space-y-6">
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
              src={viewedUser.avatar 
                ? `${import.meta.env.VITE_API_BASE}${viewedUser.avatar}`
                : `${import.meta.env.VITE_API_BASE}/img/user/pc1.jpg`
              }
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
    </div>
  );
}
