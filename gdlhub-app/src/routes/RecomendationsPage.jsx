import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";

export const RecomendationsPage = () => {
  const [recommendations, setRecommendations] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    if (!user) return;
    fetch(`${import.meta.env.VITE_API_BASE}/users/${user.id}/recommendations`)
      .then((res) => res.json())
      .then(setRecommendations)
      .catch((err) => console.error("Error fetching recommendations:", err));
  }, [user]);

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold text-white text-center">Recomendaciones</h1>

      {recommendations.length === 0 ? (
        <p className="text-gray-300 text-center">No hay recomendaciones aún.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((r) => (
            <Link
              to={`/restaurants/${r.restaurant_id}`}
              key={r.restaurant_id}
              className="bg-neutral-700 p-4 rounded-2xl shadow-lg hover:bg-neutral-600 transition-colors"
            >
              <img
                src={`${import.meta.env.VITE_API_BASE}/img/restaurant/${r.image}`}
                alt={r.name}
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <h2 className="text-xl font-semibold text-white">{r.name}</h2>
              <p className="text-sm text-gray-300">
                Calificación promedio: {r.avg_rating} ⭐
              </p>

              {Array.isArray(r.specialties) && r.specialties.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
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

              {(() => {
                const names = [...new Set(r.similar_users)].slice(0, 3);
                const last = names.pop();
                const usersText = names.length
                  ? `${names.join(", ")} y ${last}`
                  : last;

                const verb = names.length === 0 ? "le gustó" : "les gustó";

                return (
                  <p className="text-sm text-gray-400 italic mt-2">
                    Porque a {usersText} {verb} {r.common_restaurant}
                  </p>
                );
              })()}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
