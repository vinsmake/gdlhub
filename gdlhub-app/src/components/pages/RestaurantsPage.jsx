import { useEffect, useState } from "react";

export function RestaurantsList() {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/restaurants")
      .then(res => res.json())
      .then(data => setRestaurants(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>Restaurantes</h2>
      <ul>
        {restaurants.map(r => (
          <li key={r.id}>
            <strong>{r.name}</strong> – {r.description} ({r.address})
          </li>
        ))}
      </ul>
    </div>
  );
}
