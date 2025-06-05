import { API_BASE } from "@/config";

export async function usersLoader() {
  const res = await fetch(`${API_BASE}/users`);
  return res.json();
}
