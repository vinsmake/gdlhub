import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";

export const SavedPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    if (!user) return;
    fetch(`http://localhost:3000/users/${user.id}/favorite-restaurants`)
      .then((res) => res.json())
      .then(setRestaurants)
      .catch((err) => console.error("Error fetching saved restaurants:", err));
  }, [user]);

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold text-white text-center">Restaurantes guardados</h1>

      {restaurants.length === 0 ? (
        <p className="text-gray-300 text-center">No has guardado ningún restaurante.</p>
      ) : (
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

              {Array.isArray(r.specialties) && r.specialties.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {r.specialties.map((sp, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-red-600 text-white px-2 py-1 rounded-full"
                    >
                      {sp}
                    </span>
                  ))}
                </div>
              )}

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
      )}
    </div>
  );
};
