import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RestaurantPost() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    address: "",
    maps: "",
  });

  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch("http://localhost:3000/restaurants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Error al registrar restaurante");

      navigate("/restaurants");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-neutral-800 p-6 rounded-xl text-white space-y-6 shadow-lg mt-10">
      <h1 className="text-3xl font-bold mb-4">Registrar nuevo restaurante</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Nombre"
          value={form.name}
          onChange={handleChange}
          className="w-full p-2 rounded bg-neutral-700 text-white"
          required
        />
        <textarea
          name="description"
          placeholder="Descripción"
          value={form.description}
          onChange={handleChange}
          className="w-full p-2 rounded bg-neutral-700 text-white"
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Dirección"
          value={form.address}
          onChange={handleChange}
          className="w-full p-2 rounded bg-neutral-700 text-white"
          required
        />
        <input
          type="text"
          name="maps"
          placeholder="Embed URL de Google Maps"
          value={form.maps}
          onChange={handleChange}
          className="w-full p-2 rounded bg-neutral-700 text-white"
        />

        {error && <p className="text-red-400">{error}</p>}

        <button
          type="submit"
          className="bg-fuchsia-600 hover:bg-fuchsia-500 px-6 py-2 rounded text-white font-semibold transition"
        >
          Registrar
        </button>
      </form>
    </div>
  );
}
