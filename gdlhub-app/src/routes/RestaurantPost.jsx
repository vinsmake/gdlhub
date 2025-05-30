import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RestaurantPost() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    address: "",
    maps: "",
  });

  const [specialties, setSpecialties] = useState([""]);
  const [menuItems, setMenuItems] = useState([{ name: "", price: "", category: "", description: "" }]);

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
        body: JSON.stringify({
          ...form,
          specialties: specialties.filter((s) => s.trim() !== ""),
          menu: menuItems.filter((item) => item.name.trim() !== ""),
        }),
      });

      if (!res.ok) throw new Error("Error al registrar restaurante");

      navigate("/restaurants");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-neutral-800 p-6 rounded-2xl text-white space-y-6 shadow-lg mt-10">
      <h1 className="text-3xl font-bold mb-4">Registrar nuevo restaurante</h1>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <input name="name" placeholder="Nombre" value={form.name} onChange={handleChange} className="w-full p-2 rounded bg-neutral-700" required />
        <textarea name="description" placeholder="Descripción" value={form.description} onChange={handleChange} className="w-full p-2 rounded bg-neutral-700" required />
        <input name="address" placeholder="Dirección" value={form.address} onChange={handleChange} className="w-full p-2 rounded bg-neutral-700" required />
        <input name="maps" placeholder="Embed URL de Google Maps" value={form.maps} onChange={handleChange} className="w-full p-2 rounded bg-neutral-700" />

        <div>
          <h2 className="text-xl font-semibold mt-4 mb-2">Especialidades</h2>
          {specialties.map((spec, index) => (
            <input
              key={index}
              type="text"
              placeholder={`Especialidad ${index + 1}`}
              value={spec}
              onChange={(e) => {
                const copy = [...specialties];
                copy[index] = e.target.value;
                setSpecialties(copy);
              }}
              className="w-full p-2 mb-2 rounded bg-neutral-700"
            />
          ))}
          {specialties.length < 5 && (
            <button type="button" onClick={() => setSpecialties([...specialties, ""])} className="text-sm text-blue-400 mt-1">+ Agregar especialidad</button>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold mt-4 mb-2">Menú</h2>
          {menuItems.map((item, index) => (
            <div key={index} className="space-y-2 mb-4 bg-neutral-700 p-4 rounded-xl">
              <input
                type="text"
                placeholder="Nombre del platillo"
                value={item.name}
                onChange={(e) => {
                  const copy = [...menuItems];
                  copy[index].name = e.target.value;
                  setMenuItems(copy);
                }}
                className="w-full p-2 rounded"
              />
              <input
                type="number"
                step="0.01"
                placeholder="Precio"
                value={item.price}
                onChange={(e) => {
                  const copy = [...menuItems];
                  copy[index].price = e.target.value;
                  setMenuItems(copy);
                }}
                className="w-full p-2 rounded"
              />
              <input
                type="text"
                placeholder="Categoría (ej. Bebida, Desayuno)"
                value={item.category}
                onChange={(e) => {
                  const copy = [...menuItems];
                  copy[index].category = e.target.value;
                  setMenuItems(copy);
                }}
                className="w-full p-2 rounded"
              />
              <textarea
                placeholder="Descripción"
                value={item.description}
                onChange={(e) => {
                  const copy = [...menuItems];
                  copy[index].description = e.target.value;
                  setMenuItems(copy);
                }}
                className="w-full p-2 rounded"
              />
            </div>
          ))}
          {menuItems.length < 10 && (
            <button type="button" onClick={() => setMenuItems([...menuItems, { name: "", price: "", category: "", description: "" }])} className="text-sm text-blue-400 mt-1">+ Agregar platillo</button>
          )}
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <button
          type="submit"
          className="bg-red-600 hover:bg-red-500 px-6 py-2 rounded text-white font-semibold transition"
        >
          Registrar
        </button>
      </form>
    </div>
  );
}
