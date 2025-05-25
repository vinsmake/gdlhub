import { useLoaderData } from "react-router-dom";

export default function UserDetail() {
  const user = useLoaderData();
  return (
    <div>
      <h2>{user.name}</h2>
      <p>Email: {user.email}</p>
      <img
        src={`http://localhost:3000/img/user/${user.avatar}`}
        alt={user.name}
        className="w-16 h-16 rounded-full object-cover"
      />
    </div>
  );
}
