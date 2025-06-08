import { useLoaderData } from "react-router-dom";
import { useEffect, useState } from "react";

export default function UserDetail() {
  const user = useLoaderData();
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:3000/users/${user.id}/follow`)
      .then(res => res.json())
      .then(data => setFollowing(data.following));
  }, [user.id]);

  const toggleFollow = () => {
    fetch(`http://localhost:3000/users/${user.id}/follow`, {
      method: following ? "DELETE" : "POST",
    }).then(() => setFollowing(!following));
  };

  return (
    <div className="text-white space-y-4">
      <h2 className="text-2xl font-bold">{user.name}</h2>
      <p>Email: {user.email}</p>
      <img
        src={`http://localhost:3000/img/user/${user.avatar}`}
        alt={user.name}
        className="w-16 h-16 rounded-full object-cover"
      />
      <button
        onClick={toggleFollow}
        className={`px-4 py-2 rounded font-semibold transition ${
          following ? "bg-gray-600 hover:bg-gray-500" : "bg-red-600 hover:bg-red-500"
        }`}
      >
        {following ? "Dejar de seguir" : "Seguir"}
      </button>
    </div>
  );
}
