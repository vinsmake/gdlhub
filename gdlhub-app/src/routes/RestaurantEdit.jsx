import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { getRestaurantImageUrl, getDishImageUrl } from "../utils/imageUtils";

export default function RestaurantEdit() {
  const { rid } = useParams();
  const navigate = useNavigate();
  const { token } = useUser();

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [newRestaurantImage, setNewRestaurantImage] = useState(null);
  const [loading, setLoading] = useState(false);

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
    setLoading(true);

    try {
      const formData = new FormData();
      
      // Datos básicos
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("address", form.address);
      formData.append("maps", form.maps);
      formData.append("specialties", JSON.stringify(specialties.filter((s) => s.trim() !== "")));
      formData.append("menu", JSON.stringify(menuItems.filter((m) => m.name.trim() !== "")));
      
      // Imagen de restaurante
      console.log('🖼️ [EDIT] Nueva imagen de restaurante:', {
        hasImage: !!newRestaurantImage,
        fileName: newRestaurantImage?.name,
        fileSize: newRestaurantImage?.size,
        fileType: newRestaurantImage?.type
      });
      
      if (newRestaurantImage) {
        formData.append("image", newRestaurantImage);
      }
      
      // Imágenes de platillos
      console.log('🍽️ [EDIT] Procesando imágenes de platillos...');
      menuItems.forEach((item, index) => {
        if (item.newImage) {
          console.log(`🍽️ [EDIT] Imagen platillo ${index}:`, {
            name: item.name,
            fileName: item.newImage?.name,
            fileSize: item.newImage?.size
          });
          formData.append(`menuImage_${index}`, item.newImage);
        }
      });

      console.log('📤 [EDIT] Enviando request a:', `${import.meta.env.VITE_API_BASE}/restaurants/${rid}`);
      console.log('📤 [EDIT] FormData entries:', Array.from(formData.entries()).map(([key, value]) => ({
        key,
        isFile: value instanceof File,
        fileName: value instanceof File ? value.name : typeof value
      })));

      const res = await fetch(`${import.meta.env.VITE_API_BASE}/restaurants/${rid}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      console.log('📥 [EDIT] Response status:', res.status, res.statusText);
      console.log('📥 [EDIT] Response headers:', Object.fromEntries(res.headers.entries()));

      if (!res.ok) {
        const errorText = await res.text();
        console.error('❌ [EDIT] Error response body:', errorText);
        throw new Error(`Error ${res.status}: ${errorText}`);
      }

      const responseData = await res.json();
      console.log('✅ [EDIT] Success response:', responseData);

      navigate(`/restaurants/${rid}`);
    } catch (err) {
      console.error('❌ [EDIT] Caught error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
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

        {/* Imagen del restaurante */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Imagen del restaurante</h2>
          {data.image && (
            <div className="mb-4">
              <p className="text-sm text-gray-400 mb-2">Imagen actual:</p>
              <img
                src={getRestaurantImageUrl(data.image)}
                alt="Imagen actual"
                className="w-32 h-32 object-cover rounded-lg border border-neutral-600"
              />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setNewRestaurantImage(e.target.files[0])}
            className="w-full p-2 rounded bg-neutral-700 border border-neutral-600 focus:border-red-500 focus:outline-none"
          />
          <p className="text-xs text-gray-400 mt-1">
            Selecciona una nueva imagen para reemplazar la actual (opcional)
          </p>
        </div>

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

              {/* Imagen del platillo */}
              <div className="mt-4">
                <label className="text-sm font-semibold block text-white mb-2">Imagen del platillo:</label>
                {item.image && (
                  <div className="mb-2">
                    <p className="text-xs text-gray-400 mb-1">Imagen actual:</p>
                    <img
                      src={getDishImageUrl(item.image)}
                      alt={item.name || 'Platillo'}
                      className="w-20 h-20 object-cover rounded border border-neutral-600"
                    />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const copy = [...menuItems];
                    copy[index].newImage = e.target.files[0];
                    setMenuItems(copy);
                  }}
                  className="w-full p-2 rounded bg-neutral-700 border border-neutral-600 focus:border-red-500 focus:outline-none text-sm"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Selecciona una nueva imagen para reemplazar la actual (opcional)
                </p>
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

        <button 
          type="submit" 
          disabled={loading}
          className="bg-red-600 hover:bg-red-500 disabled:bg-red-700 disabled:opacity-50 px-6 py-2 rounded text-white font-semibold transition"
        >
          {loading ? "Guardando..." : "Guardar cambios"}
        </button>
      </form>
    </div>
  );
}
