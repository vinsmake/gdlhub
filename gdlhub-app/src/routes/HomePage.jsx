import { useLoaderData, Link } from "react-router-dom";
import { useEffect, useState } from "react";


export default function RestaurantsPage() {
  const { restaurants, users } = useLoaderData();


  const [feed, setFeed] = useState([]);

  useEffect(() => {
    // Simula que el usuario loggeado es el ID 1
    fetch("http://localhost:3000/users/1/feed")
      .then(res => res.json())
      .then(setFeed);
  }, []);


  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-white text-center mb-10">
        Inicio
      </h1>

      {feed.length > 0 && (
        <>
          <h2 className="text-2xl font-semibold text-white mt-8">Actividad reciente</h2>
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
                    {/* Comentario */}
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
                        {/* Imagen tipo portada */}
                        {item.restaurant_image && (
                          <Link
                            to={`/restaurants/${item.restaurant_id}`}
                            className="w-24 h-36 rounded-md overflow-hidden flex-shrink-0 border border-neutral-600 bg-neutral-700 hover:opacity-90 transition"
                          >
                            <img
                              src={`http://localhost:3000/img/restaurant/${item.restaurant_image}`}
                              alt={item.restaurant_name}
                              className="w-full h-full object-cover"
                            />
                          </Link>
                        )}

                        {/* Texto del contenido */}
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


                    {/* Seguimiento */}
                    {item.type === "followed" && (
                      <p className="text-sm text-gray-400">
                        <strong className="text-white">{item.user_name}</strong> empezó a seguir a{" "}
                        <span className="text-white">{item.content}</span>
                      </p>
                    )}

                    {/* Fecha */}
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






      <h2 className="text-2xl font-semibold text-white">Usuarios que sigues</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((u) => (
          <Link
            to={`/users/${u.id}`}
            key={u.id}
            className="bg-neutral-700 p-4 rounded-2xl shadow-lg hover:bg-neutral-600 transition-colors"
          >
            <div className="flex items-center gap-4">
              <img
                src={`http://localhost:3000/img/user/${u.avatar}`}
                alt={u.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="space-y-1">
                <h2 className="text-xl font-semibold text-white">{u.name}</h2>
                <p className="text-sm text-gray-300">{u.email}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>



      <h2 className="text-2xl font-semibold text-white mt-10">Restaurantes que sigues</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.map((r) => (
          <Link
            to={`/restaurants/${r.id}`}
            key={r.id}
            className="bg-neutral-700 p-4 rounded-2xl shadow-lg space-y-3 hover:bg-neutral-600 transition-colors"
          >
            <div className="flex items-center gap-4">
              {r.image && (
                <div className="w-16 h-16 rounded-full overflow-hidden bg-neutral-600">
                  <img
                    src={`http://localhost:3000/img/restaurant/${r.image}`}
                    alt={r.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div>
                <h2 className="text-2xl font-semibold text-white">{r.name}</h2>
                <p className="text-sm text-gray-300">{r.description}</p>
                <p className="text-sm text-gray-400">{r.address}</p>
              </div>
            </div>

            <div className="mt-2">
              <iframe
                src={r.maps}
                width="100%"
                height="200"
                className="rounded-lg"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}
