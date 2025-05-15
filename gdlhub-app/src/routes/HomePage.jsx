import { useLoaderData, Link } from "react-router-dom";

export default function RestaurantsPage() {
  const { restaurants, users } = useLoaderData();

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-white text-center mb-10">
        Inicio
      </h1>

<h2 className="text-2xl font-semibold text-white">Seguidos</h2>
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {users.map((u) => (
    <Link
      to={`/users/${u.id}`}
      key={u.id}
      className="bg-neutral-700 p-4 rounded-2xl shadow-lg space-y-3 hover:bg-neutral-600 transition-colors"
    >
      <h2 className="text-2xl font-semibold text-white">{u.name}</h2>
      <p className="text-sm text-gray-300">{u.email}</p>
    </Link>
  ))}
</div>


      <h2 className="text-2xl font-semibold text-white mt-10">Lista de Restaurantes</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.map((r) => (
          <Link
            to={`/restaurants/${r.id}`}
            key={r.id}
            className="bg-neutral-700 p-4 rounded-2xl shadow-lg space-y-3 hover:bg-neutral-600 transition-colors"
          >
            <h2 className="text-2xl font-semibold text-white">{r.name}</h2>
            <p className="text-sm text-gray-300">{r.description}</p>
            <p className="text-sm text-gray-400">{r.address}</p>
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
