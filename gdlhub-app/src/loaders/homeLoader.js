export async function homeLoader() {
  const [resRestaurants, resUsers] = await Promise.all([
    fetch("http://localhost:3000/restaurants"),
    fetch("http://localhost:3000/users"),
  ]);

  const [restaurants, users] = await Promise.all([
    resRestaurants.json(),
    resUsers.json(),
  ]);

  return { restaurants, users };
}
