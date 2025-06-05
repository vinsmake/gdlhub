import { API_BASE } from "@/config";

export async function restaurantsLoader() {
  const res = await fetch(`${API_BASE}/restaurants`);
  return res.json();
}
