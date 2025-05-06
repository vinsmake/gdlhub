import { useLoaderData } from "react-router-dom";

export default function UsersPage() {
  const users = useLoaderData();

  return (
    <div className=" bg-gradient-to-br from-purple-900 via-fuchsia-700 to-pink-600 p-10">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-white drop-shadow-lg mb-12">
          Lista de Usuarios
        </h1>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {users.map(user => (
            <li
              key={user.id}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl p-6 text-white hover:scale-105 transform transition duration-300 ease-out"
            >
              <h2 className="text-2xl font-semibold">{user.name}</h2>
              <p className="text-fuchsia-200">{user.email}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
