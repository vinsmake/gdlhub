export async function restaurantEditLoader({ params }) {
  const res = await fetch(`http://localhost:3000/restaurants/${params.rid}`);
  if (!res.ok) throw new Error("No se pudo cargar el restaurante");
  return res.json();
}
