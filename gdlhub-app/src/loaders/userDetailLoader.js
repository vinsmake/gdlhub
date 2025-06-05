import { API_BASE } from "@/config";

export async function userDetailLoader({ params }) {
  const res = await fetch(`${API_BASE}/users/${params.uid}`);
  return res.json();
}
