import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const RecomendationsPage = () => {
  const [recommendations, setRecommendations] = useState([]);
  const userId = 1; // temporal o desde contexto/autenticación

  useEffect(() => {
    fetch(`http://localhost:3000/users/${userId}/recommendations`)
      .then((res) => res.json())
      .then(setRecommendations)
      .catch((err) => console.error("Error fetching recommendations:", err));
  }, [userId]);

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
                src={`http://localhost:3000/img/restaurant/${r.image}`}
                alt={r.name}
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <h2 className="text-xl font-semibold text-white">{r.name}</h2>
              <p className="text-sm text-gray-300">Calificación promedio: {r.avg_rating} ⭐</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
