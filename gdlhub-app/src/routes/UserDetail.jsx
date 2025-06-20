import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

export default function UserDetail() {
  const { uid } = useParams(); // ← para obtener el ID de la URL
  const { user, token } = useUser();
  const navigate = useNavigate();

  const [viewedUser, setViewedUser] = useState(null);
  const [following, setFollowing] = useState(false);

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

  return (
    <div className="text-white space-y-4">
      <h2 className="text-2xl font-bold">{viewedUser.name}</h2>
      <p>Email: {viewedUser.email}</p>
      <img
        src={`http://localhost:3000/img/user/${viewedUser.avatar}`}
        alt={viewedUser.name}
        className="w-16 h-16 rounded-full object-cover"
      />
      {user?.id !== viewedUser.id && (
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
      )}
    </div>
  );
}
