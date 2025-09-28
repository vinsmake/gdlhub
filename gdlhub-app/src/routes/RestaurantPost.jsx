import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";


export default function RestaurantPost() {
  const { token, user } = useUser();
  const navigate = useNavigate();
  
  // Redirigir si no está autenticado
  useEffect(() => {
    if (!user || !token) {
      navigate("/login");
    }
  }, [user, token, navigate]);

  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE}/menu/meta`)
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.categories || []);
        setTags(data.tags || []);
      })
      .catch(() => setError("Error al cargar categorías y etiquetas"));
  }, []);

  const [form, setForm] = useState({
    name: "",
    description: "",
    address: "",
    maps: ""
  });

  const [specialties, setSpecialties] = useState([""]);
  const [menuItems, setMenuItems] = useState([
    { name: "", price: "", description: "", category_ids: [], tag_ids: [], image: null },
  ]);

  // Estados para INE y validación
  const [ineFile, setIneFile] = useState(null);
  const [inePreview, setInePreview] = useState(null);
  const [restaurantImage, setRestaurantImage] = useState(null);
  const [restaurantImagePreview, setRestaurantImagePreview] = useState(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Estado para ubicación del mapa


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleIneChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tamaño de archivo INE (máximo 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        setError(`El archivo INE es demasiado grande. Máximo 10MB permitido. Tu archivo: ${(file.size / 1024 / 1024).toFixed(1)}MB`);
        return;
      }
      
      setIneFile(file);
      
      // Crear preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setInePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRestaurantImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tamaño de archivo (máximo 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        setError(`La imagen del restaurante es demasiado grande. Máximo 5MB.`);
        return;
      }
      
      setRestaurantImage(file);
      
      // Crear preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setRestaurantImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMenuImageChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tamaño de archivo (máximo 5MB por imagen)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        setError(`La imagen "${file.name}" es demasiado grande. Máximo 5MB por imagen.`);
        return;
      }
      
      const copy = [...menuItems];
      copy[index].image = file;
      
      // Crear preview
      const reader = new FileReader();
      reader.onload = (e) => {
        copy[index].imagePreview = e.target.result;
        setMenuItems(copy);
      };
      reader.readAsDataURL(file);
    }
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validaciones
    if (!ineFile) {
      setError("Es obligatorio subir una copia de tu INE para verificar tu identidad");
      return;
    }

    if (!acceptedTerms) {
      setError("Debes aceptar los términos y condiciones");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      
      // Datos del restaurante
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("address", form.address);
      formData.append("maps", form.maps);
      
      // Imagen del restaurante
      if (restaurantImage) {
        formData.append("image", restaurantImage);
      }
      
      // Especialidades
      const validSpecialties = specialties.filter((s) => s.trim() !== "");
      formData.append("specialties", JSON.stringify(validSpecialties));
      
      // INE
      formData.append("ineDocument", ineFile);
      
      // Menú con imágenes
      const validMenuItems = menuItems.filter((item) => item.name.trim() !== "");
      const menuData = validMenuItems.map(({ imagePreview, ...item }) => item); // Remover preview
      formData.append("menu", JSON.stringify(menuData));
      
      // Imágenes de platillos
      validMenuItems.forEach((item, index) => {
        if (item.image) {
          formData.append(`menuImage_${index}`, item.image);
        }
      });

      const res = await fetch(`${import.meta.env.VITE_API_BASE}/restaurants`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Error al registrar restaurante");
      }

      navigate("/restaurants");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user || !token) {
    return <div className="text-white text-center p-6">Redirigiendo...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-neutral-800 p-6 rounded-2xl text-white space-y-6 shadow-lg mt-10">
      <h1 className="text-3xl font-bold mb-4">🏪 Registrar nuevo restaurante</h1>
      
      {/* Aviso de privacidad */}
      <div className="bg-red-600/20 border border-red-500 rounded-xl p-4">
        <h3 className="font-semibold mb-2">⚠️ Importante - Términos y Condiciones</h3>
        <ul className="text-sm space-y-1">
          <li>• Es obligatorio subir una copia de tu INE para verificar tu identidad</li>
          <li>• No nos hacemos responsables por información falsa o engañosa</li>
          <li>• Los restaurantes con datos falsos serán eliminados sin previo aviso</li>
          <li>• Tu INE será utilizada únicamente para verificación y no será compartida</li>
        </ul>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Verificación de identidad */}
        <div className="bg-neutral-700 p-4 rounded-xl">
          <h3 className="text-lg font-semibold mb-3">📄 Verificación de Identidad</h3>
          <div className="space-y-3">
            <label className="block text-sm font-medium">
              Subir copia de INE (Frente y reverso en una sola imagen) *
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleIneChange}
              required
              className="w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-600 file:text-white hover:file:bg-red-500"
            />
            {inePreview && (
              <div className="mt-2">
                <img src={inePreview} alt="Preview INE" className="max-w-xs rounded border" />
              </div>
            )}
          </div>
        </div>

        {/* Datos del restaurante */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">🍽️ Información del Restaurante</h3>
          <input name="name" placeholder="Nombre del restaurante" value={form.name} onChange={handleChange} className="w-full p-3 rounded bg-neutral-700 border border-neutral-600 focus:border-red-500 focus:outline-none" required />
          <textarea name="description" placeholder="Descripción del restaurante" value={form.description} onChange={handleChange} className="w-full p-3 rounded bg-neutral-700 border border-neutral-600 focus:border-red-500 focus:outline-none h-24 resize-none" required />
          <input name="address" placeholder="Dirección completa" value={form.address} onChange={handleChange} className="w-full p-3 rounded bg-neutral-700 border border-neutral-600 focus:border-red-500 focus:outline-none" required />

          {/* Imagen del restaurante */}
          <div>
            <label className="block text-sm font-medium mb-2">📸 Imagen del restaurante (recomendado)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleRestaurantImageChange}
              className="w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-600 file:text-white hover:file:bg-red-500"
            />
            {restaurantImagePreview && (
              <div className="mt-2">
                <img src={restaurantImagePreview} alt="Preview restaurante" className="w-32 h-32 object-cover rounded border" />
              </div>
            )}
          </div>

          <input name="maps" placeholder="URL de Google Maps (opcional)" value={form.maps} onChange={handleChange} className="w-full p-3 rounded bg-neutral-700 border border-neutral-600 focus:border-red-500 focus:outline-none" />
        </div>

        {/* Especialidades */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">🍽️ Especialidades</h3>
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
              className="w-full p-3 rounded bg-neutral-700 border border-neutral-600 focus:border-red-500 focus:outline-none"
            />
          ))}
          {specialties.length < 5 && (
            <button type="button" onClick={() => setSpecialties([...specialties, ""])} className="text-sm text-blue-400 hover:text-blue-300">+ Agregar especialidad</button>
          )}
        </div>

        {/* Menú con imágenes */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">📋 Menú</h3>
          {menuItems.map((item, index) => (
            <div key={index} className="bg-neutral-700 p-4 rounded-xl space-y-3 border border-neutral-600">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Platillo {index + 1}</h4>
                {menuItems.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      const copy = [...menuItems];
                      copy.splice(index, 1);
                      setMenuItems(copy);
                    }}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    Eliminar
                  </button>
                )}
              </div>

              {/* Imagen del platillo */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Imagen del platillo (opcional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleMenuImageChange(index, e)}
                  className="w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-600 file:text-white hover:file:bg-green-500"
                />
                {item.imagePreview && (
                  <div className="mt-2">
                    <img src={item.imagePreview} alt="Preview platillo" className="w-32 h-32 object-cover rounded border" />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Nombre del platillo"
                  value={item.name}
                  onChange={(e) => {
                    const copy = [...menuItems];
                    copy[index].name = e.target.value;
                    setMenuItems(copy);
                  }}
                  className="w-full p-3 rounded bg-neutral-600 border border-neutral-500 focus:border-red-500 focus:outline-none"
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Precio ($)"
                  value={item.price}
                  onChange={(e) => {
                    const copy = [...menuItems];
                    copy[index].price = e.target.value;
                    setMenuItems(copy);
                  }}
                  className="w-full p-3 rounded bg-neutral-600 border border-neutral-500 focus:border-red-500 focus:outline-none"
                />
              </div>
              
              <textarea
                placeholder="Descripción del platillo"
                value={item.description}
                onChange={(e) => {
                  const copy = [...menuItems];
                  copy[index].description = e.target.value;
                  setMenuItems(copy);
                }}
                className="w-full p-3 rounded bg-neutral-600 border border-neutral-500 focus:border-red-500 focus:outline-none h-20 resize-none"
              />

              {/* Categorías */}
              <div>
                <label className="text-sm font-medium block text-white mb-2">Categorías:</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <label key={cat.id} className="flex items-center gap-1 text-sm text-gray-300 bg-neutral-600 px-2 py-1 rounded">
                      <input
                        type="checkbox"
                        checked={item.category_ids?.includes(cat.id) || false}
                        onChange={(e) => {
                          const copy = [...menuItems];
                          const ids = copy[index].category_ids || [];
                          copy[index].category_ids = e.target.checked
                            ? [...ids, cat.id]
                            : ids.filter((id) => id !== cat.id);
                          setMenuItems(copy);
                        }}
                      />
                      {cat.name}
                    </label>
                  ))}
                </div>
              </div>

              {/* Etiquetas */}
              <div>
                <label className="text-sm font-medium block text-white mb-2">Etiquetas:</label>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <label key={tag.id} className="flex items-center gap-1 text-sm text-gray-300 bg-neutral-600 px-2 py-1 rounded">
                      <input
                        type="checkbox"
                        checked={item.tag_ids?.includes(tag.id) || false}
                        onChange={(e) => {
                          const copy = [...menuItems];
                          const ids = copy[index].tag_ids || [];
                          copy[index].tag_ids = e.target.checked
                            ? [...ids, tag.id]
                            : ids.filter((id) => id !== tag.id);
                          setMenuItems(copy);
                        }}
                      />
                      {tag.name}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setMenuItems([
                ...menuItems,
                { name: "", price: "", description: "", category_ids: [], tag_ids: [], image: null },
              ])
            }
            className="w-full bg-green-600/20 border-2 border-dashed border-green-500 text-green-400 py-3 rounded-xl hover:bg-green-600/30 transition"
          >
            + Agregar platillo
          </button>
        </div>

        {/* Términos y condiciones */}
        <div className="bg-neutral-700 p-4 rounded-xl">
          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              required
              className="mt-1"
            />
            <div className="text-sm text-gray-300">
              <span className="text-white font-medium">Acepto los términos y condiciones *</span>
              <p className="mt-1">
                Al registrar mi restaurante confirmo que toda la información proporcionada es verídica. 
                Entiendo que GDLHUB no se hace responsable por información falsa y que los restaurantes 
                con datos incorrectos serán eliminados sin previo aviso.
              </p>
            </div>
          </label>
        </div>

        {error && (
          <div className="p-3 bg-red-600/20 border border-red-500 rounded text-red-400">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !acceptedTerms}
          className="w-full bg-red-600 hover:bg-red-500 disabled:bg-gray-600 disabled:cursor-not-allowed px-6 py-3 rounded text-white font-semibold transition"
        >
          {loading ? "Registrando restaurante..." : "🏪 Registrar Restaurante"}
        </button>
      </form>
    </div>
  );
}
