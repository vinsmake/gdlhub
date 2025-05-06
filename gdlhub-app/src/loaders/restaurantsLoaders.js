export async function restaurantsLoader() {
    const res = await fetch('http://localhost:3000/restaurants');
    return res.json();
  }
  