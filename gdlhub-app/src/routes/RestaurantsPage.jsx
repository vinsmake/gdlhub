import { useLoaderData } from "react-router-dom";

export default function RestaurantsPage() {
  const restaurants = useLoaderData();
  return (
    <div>
      <h1>Restaurantes</h1>
      <ul>
        {restaurants.map(r => (
          <li key={r.id}>{r.name} - {r.address} - {r.maps}</li>
        ))}
      </ul>
    </div>
  );
}
