export async function homeLoader() {
  const [usersRes, restaurantsRes] = await Promise.all([
    fetch("http://localhost:3000/users/1/following"),
    fetch("http://localhost:3000/users/1/favorite-restaurants")
  ]);

  return {
    users: await usersRes.json(),
    restaurants: await restaurantsRes.json()
  };
}
