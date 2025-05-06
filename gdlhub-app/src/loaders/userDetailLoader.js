export async function userDetailLoader({ params }) {
    const res = await fetch(`http://localhost:3000/users/${params.uid}`);
    return res.json();
  }
  