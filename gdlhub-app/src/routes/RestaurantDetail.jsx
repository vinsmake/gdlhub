import { useLoaderData } from "react-router-dom";

export default function RestaurantDetail() {
  const restaurant = useLoaderData();
  return (
    <div>
      <h2>{restaurant.name}</h2>
      <p>Ubicación: {restaurant.location}</p>
    </div>
  );
}
