import { useLoaderData, Link } from "react-router-dom";

export default function UsersPage() {
  const users = useLoaderData();

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-white text-center mb-10">
        Usuarios
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((u) => (
          <Link
            to={`/users/${u.id}`}
            key={u.id}
            className="bg-neutral-700 p-4 rounded-2xl shadow-lg space-y-3 hover:bg-neutral-600 transition-colors text-center"
          >
            <img
              src={`http://localhost:3000/img/user/${u.avatar}`}
              alt={u.name}
              className="w-24 h-24 mx-auto rounded-full object-cover"
            />
            <h2 className="text-2xl font-semibold text-white">{u.name}</h2>
            <p className="text-sm text-gray-300">{u.email}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
