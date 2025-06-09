import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE } from "@/config";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [feed, setFeed] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/users`)
      .then(res => res.json())
      .then(setUsers);

    fetch(`${API_BASE}/feed`)
      .then(res => res.json())
      .then(setFeed);
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-white text-center mb-10">
        Usuarios
      </h1>

      {feed.length > 0 && (
        <>
          <h2 className="text-2xl font-semibold text-white mt-8">Actividad de todos los usuarios</h2>
          <div className="space-y-6">
            {feed.map((item, idx) => (
              <div
                key={idx}
                className="bg-neutral-800 border border-neutral-600 rounded-2xl p-4 shadow-lg"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={`http://localhost:3000/img/user/${item.avatar}`}
                    alt={item.user_name}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  <div className="flex-1 space-y-2">
                    {item.type === "comment" && (
                      <>
                        <p className="text-sm text-gray-400">
                          <strong className="text-white">{item.user_name}</strong> comentó en{" "}
                          <Link
                            to={`/restaurants/${item.restaurant_id}`}
                            className="text-white underline"
                          >
                            {item.restaurant_name}
                          </Link>:
                        </p>
                        <p className="text-base text-gray-200">{item.content}</p>
                        <div className="border-l-4 border-neutral-600 pl-4 mt-2">
                          <p className="text-sm text-gray-300">
                            Comentado sobre:{" "}
                            <Link
                              to={`/restaurants/${item.restaurant_id}`}
                              className="font-semibold text-white underline"
                            >
                              {item.restaurant_name}
                            </Link>
                          </p>
                          <p className="text-xs text-gray-500">{item.restaurant_description}</p>
                          <p className="text-xs text-gray-500 italic">{item.restaurant_address}</p>
                        </div>
                      </>
                    )}

                    {item.type === "favorite" && (
                      <div className="flex gap-4">
                        {item.restaurant_image && (
                          <Link
                            to={`/restaurants/${item.restaurant_id}`}
                            className="w-24 h-36 flex-shrink-0 bg-white rounded-md shadow-inner border border-gray-300 overflow-hidden hover:opacity-90 transition"
                          >
                            <img
                              src={`http://localhost:3000/img/restaurant/${item.restaurant_image}`}
                              alt={item.restaurant_name}
                              className="w-full h-full object-cover"
                            />
                          </Link>
                        )}

                        <div className="flex-1 space-y-2">
                          <p className="text-sm text-gray-400">
                            <strong className="text-white">{item.user_name}</strong> marcó como favorito{" "}
                            <Link
                              to={`/restaurants/${item.restaurant_id}`}
                              className="text-white underline"
                            >
                              {item.restaurant_name}
                            </Link>
                          </p>
                          {item.restaurant_description && (
                            <p className="text-sm text-gray-300">{item.restaurant_description}</p>
                          )}
                          {item.restaurant_address && (
                            <p className="text-xs text-gray-500 italic">{item.restaurant_address}</p>
                          )}
                        </div>
                      </div>
                    )}

                    {item.type === "followed" && (
                      <p className="text-sm text-gray-400">
                        <strong className="text-white">{item.user_name}</strong> empezó a seguir a{" "}
                        <span className="text-white">{item.content}</span>
                      </p>
                    )}

                    <p className="text-xs text-gray-500">
                      {new Date(item.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
