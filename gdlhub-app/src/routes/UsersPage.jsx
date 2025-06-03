import { useLoaderData, Link } from "react-router-dom";
import { useEffect, useState } from "react";




export default function UsersPage() {
  const users = useLoaderData();

  const [feed, setFeed] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/feed")
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
          <div className="space-y-4">
            {feed.map((item, idx) => (
              <div
                key={idx}
                className="bg-neutral-700 p-4 rounded-xl hover:bg-neutral-600 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={`http://localhost:3000/img/user/${item.avatar}`}
                    alt={item.user_name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1 space-y-1">
                    {item.type === "comment" && (
                      <>
                        <p className="text-sm text-gray-400">
                          <strong className="text-white">{item.user_name}</strong> comentó en{" "}
                          <Link to={`/restaurants/${item.restaurant_id}`} className="text-white underline">
                            {item.restaurant_name}
                          </Link>:
                        </p>
                        <p className="text-base text-gray-200">{item.content}</p>
                      </>
                    )}

                    {item.type === "favorite" && (
                      <p className="text-sm text-gray-400">
                        <strong className="text-white">{item.user_name}</strong> marcó como favorito{" "}
                        <Link to={`/restaurants/${item.restaurant_id}`} className="text-white underline">
                          {item.restaurant_name}
                        </Link>
                      </p>
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
