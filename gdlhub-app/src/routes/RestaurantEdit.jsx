import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";

export default function RestaurantEdit() {
  const { rid } = useParams();
  const navigate = useNavigate();
  const { token } = useUser();

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE}/restaurants/${rid}`)
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo cargar el restaurante");
        return res.json();
      })
      .then(setData)
      .catch((err) => setError(err.message));
  }, [rid]);

  const [form, setForm] = useState({ name: "", description: "", address: "", maps: "" });
  const [specialties, setSpecialties] = useState([""]);
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    if (!data) return;

    setForm({
      name: data.name,
      description: data.description,
      address: data.address,
      maps: data.maps || "",
    });

    setSpecialties(data.specialties || [""]);

    setMenuItems(
      Array.isArray(data.menu)
        ? data.menu.map((item) => ({
          ...item,
          price: item.price || "",
          category_ids: item.category_ids || [],
          tag_ids: item.tag_ids || [],
        }))
        : []
    );

    setCategories(data.categories || []);
    setTags(data.tags || []);
  }, [data]);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/restaurants/${rid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          specialties: specialties.filter((s) => s.trim() !== ""),
          menu: menuItems.filter((m) => m.name.trim() !== ""),
        }),
      });

      if (!res.ok) throw new Error("Error al actualizar restaurante");

      navigate(`/restaurants/${rid}`);
    } catch (err) {
      setError(err.message);
    }
  };

  if (!data) return <div className="text-white text-center mt-10">Cargando...</div>;

  return (
    <div className="max-w-2xl mx-auto bg-neutral-800 p-6 rounded-2xl text-white space-y-6 shadow-lg mt-10">
      <h1 className="text-3xl font-bold mb-4">Editar restaurante</h1>
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
            <button type="button" onClick={() => setSpecialties([...specialties, ""])} className="text-sm text-blue-400">+ Agregar especialidad</button>
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
              <label className="text-sm font-semibold block text-white">Categorías:</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <label key={cat.id} className="flex items-center gap-1 text-sm text-gray-300">
                    <input
                      type="checkbox"
                      checked={menuItems[index].category_ids?.includes(cat.id)}
                      onChange={(e) => {
                        const copy = [...menuItems];
                        const selected = copy[index].category_ids || [];
                        copy[index].category_ids = e.target.checked
                          ? [...selected, cat.id]
                          : selected.filter((id) => id !== cat.id);
                        setMenuItems(copy);
                      }}
                    />
                    {cat.name}
                  </label>
                ))}
              </div>

              <label className="text-sm font-semibold block text-white mt-2">Etiquetas:</label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <label key={tag.id} className="flex items-center gap-1 text-sm text-gray-300">
                    <input
                      type="checkbox"
                      checked={menuItems[index].tag_ids?.includes(tag.id)}
                      onChange={(e) => {
                        const copy = [...menuItems];
                        const selected = copy[index].tag_ids || [];
                        copy[index].tag_ids = e.target.checked
                          ? [...selected, tag.id]
                          : selected.filter((id) => id !== tag.id);
                        setMenuItems(copy);
                      }}
                    />
                    {tag.name}
                  </label>
                ))}
              </div>
            </div>
          ))}
          {menuItems.length < 100 ? (
            <button
              type="button"
              onClick={() =>
                setMenuItems([
                  ...menuItems,
                  { name: "", price: "", description: "", category_ids: [], tag_ids: [] },
                ])
              }
              className="text-sm text-blue-400"
            >
              + Agregar platillo
            </button>
          ) : (
            <p className="text-sm text-yellow-400">Límite de 20 platillos alcanzado</p>
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
