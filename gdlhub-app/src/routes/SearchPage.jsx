import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    const delay = setTimeout(() => {
      if (query.trim() === "") {
        setResults([]);
        return;
      }

      fetch(`http://localhost:3000/restaurants/search?q=${encodeURIComponent(query)}`)
        .then((res) => res.json())
        .then((data) => {
          setResults(data);
        })
        .catch((err) => {
          console.error("Error:", err);
          setResults([]);
        });
    }, 300);

    return () => clearTimeout(delay);
  }, [query]);

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold text-white text-center">Buscar restaurantes</h1>

      <input
        type="text"
        placeholder="Ej. café, enchiladas, latte..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full max-w-xl mx-auto block px-4 py-2 rounded-xl bg-neutral-700 text-white placeholder-gray-400"
      />

      {results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {results.map((r) => (
            <Link
              key={r.id}
              to={`/restaurants/${r.id}`}
              className="bg-neutral-700 p-4 rounded-2xl shadow-lg hover:bg-neutral-600 transition-colors space-y-3"
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
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : query.trim() !== "" ? (
        <p className="text-center text-gray-400 mt-10">No se encontraron resultados.</p>
      ) : null}
    </div>
  );
};
