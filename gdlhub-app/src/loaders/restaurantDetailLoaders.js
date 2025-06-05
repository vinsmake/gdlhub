import { API_BASE } from "@/config";

export async function restaurantDetailLoader({ params }) {
  const res = await fetch(`${API_BASE}/restaurants/${params.rid}`);
  return res.json();
}
