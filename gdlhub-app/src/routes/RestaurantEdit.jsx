import { useLoaderData, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function RestaurantEdit() {
  const data = useLoaderData();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: data.name,
    description: data.description,
    address: data.address,
    maps: data.maps || "",
  });

  const [specialties, setSpecialties] = useState(data.specialties || [""]);
  const [menuItems, setMenuItems] = useState(data.menu || []);

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch(`http://localhost:3000/restaurants/${data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          specialties: specialties.filter((s) => s.trim() !== ""),
          menu: menuItems.filter((m) => m.name.trim() !== ""),
        }),
      });

      if (!res.ok) throw new Error("Error al actualizar restaurante");

      navigate(`/restaurants/${data.id}`);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-neutral-800 p-6 rounded-2xl text-white space-y-6 shadow-lg mt-10">
      <h1 className="text-3xl font-bold mb-4">Editar restaurante</h1>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Nombre"
          value={form.name}
          onChange={handleChange}
          className="w-full p-2 rounded bg-neutral-700"
          required
        />
        <textarea
          name="description"
          placeholder="Descripción"
          value={form.description}
          onChange={handleChange}
          className="w-full p-2 rounded bg-neutral-700"
          required
        />
        <input
          name="address"
          placeholder="Dirección"
          value={form.address}
          onChange={handleChange}
          className="w-full p-2 rounded bg-neutral-700"
          required
        />
        <input
          name="maps"
          placeholder="Embed URL de Google Maps"
          value={form.maps}
          onChange={handleChange}
          className="w-full p-2 rounded bg-neutral-700"
        />

        {/* Especialidades */}
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
            <button type="button" onClick={() => setSpecialties([...specialties, ""])} className="text-sm text-blue-400">
              + Agregar especialidad
            </button>
          )}
        </div>

        {/* Menú */}
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
                placeholder="Categoría"
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
            <button type="button" onClick={() => setMenuItems([...menuItems, { name: "", price: "", category: "", description: "" }])} className="text-sm text-blue-400">
              + Agregar platillo
            </button>
          )}
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <button type="submit" className="bg-red-600 hover:bg-red-500 px-6 py-2 rounded text-white font-semibold transition">
          Guardar cambios
        </button>
      </form>
    </div>
  );
}
