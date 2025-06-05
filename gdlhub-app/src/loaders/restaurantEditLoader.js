import { API_BASE } from "@/config";

export async function restaurantEditLoader({ params }) {
  const res = await fetch(`${API_BASE}/restaurants/${params.rid}`);
  if (!res.ok) throw new Error("No se pudo cargar el restaurante");
  return res.json();
}
