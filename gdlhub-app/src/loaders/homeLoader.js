import { API_BASE } from "@/config";

export async function homeLoader() {
  const [usersRes, restaurantsRes] = await Promise.all([
    fetch(`${API_BASE}/users/1/following`),
    fetch(`${API_BASE}/users/1/favorite-restaurants`)
  ]);

  return {
    users: await usersRes.json(),
    restaurants: await restaurantsRes.json()
  };
}
