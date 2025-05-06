export async function restaurantDetailLoader({ params }) {
    const res = await fetch(`http://localhost:3000/restaurants/${params.rid}`);
    return res.json();
  }
  