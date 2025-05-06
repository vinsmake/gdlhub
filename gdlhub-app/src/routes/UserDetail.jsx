import { useLoaderData } from "react-router-dom";

export default function UserDetail() {
  const user = useLoaderData();
  return (
    <div>
      <h2>{user.name}</h2>
      <p>Email: {user.email}</p>
    </div>
  );
}
