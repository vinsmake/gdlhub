import { useLoaderData } from "react-router-dom";

export default function UsersPage() {
  const users = useLoaderData();
  return (
    <div>
      <h1>Usuarios</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name} - {user.email}</li>
        ))}
      </ul>
    </div>
  );
}
