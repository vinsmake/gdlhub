import { useParams } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import { toPng } from "html-to-image";
import { useRef, useState, useEffect } from "react";
import { useUser } from "../context/UserContext";

export default function RestaurantDetail() {
  const { rid } = useParams();
  const publicUrl = import.meta.env.VITE_PUBLIC_URL;
  const restaurantUrl = `${publicUrl}/restaurants/${rid}`;
  const qrRef = useRef(null);
  const [finalImage, setFinalImage] = useState("");
  const [logoReady, setLogoReady] = useState(false);
  const [qrReady, setQrReady] = useState(false);


  const [restaurant, setRestaurant] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showLoginMessage, setShowLoginMessage] = useState(false);
  const [showCommentLoginMessage, setShowCommentLoginMessage] = useState(false);

  const { user, token } = useUser();


  useEffect(() => {
    if (!qrRef.current || !logoReady || !qrReady) return;

    const generateImage = async () => {
      try {
        const dataUrl = await toPng(qrRef.current, {
          cacheBust: true,
          pixelRatio: 2,
          skipFonts: true,
        });
        setFinalImage(dataUrl);
      } catch (err) {
        console.error("Error al generar imagen del QR:", err);
      }
    };

    // Espera un poco para evitar capturar medio render
    const timeout = setTimeout(generateImage, 100);
    return () => clearTimeout(timeout);
  }, [restaurantUrl, logoReady, qrReady]);

  useEffect(() => {
    // Marca QR como "renderizado" cuando aparece por primera vez
    if (!finalImage) {
      const timeout = setTimeout(() => {
        setQrReady(true);
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [finalImage]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE}/restaurants/${rid}`)
      .then(res => res.json())
      .then(setRestaurant);
  }, [rid]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE}/restaurants/${rid}/comments`)
      .then(res => res.json())
      .then(setComments);
  }, [rid]);

  useEffect(() => {
    if (!user || !token) return;
    fetch(`${import.meta.env.VITE_API_BASE}/restaurants/${rid}/save`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setSaved(data.saved));
  }, [rid, user, token]);

  const handleDownload = async () => {
    if (!qrRef.current) return;
    try {
      const dataUrl = await toPng(qrRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        skipFonts: true,
      });

      const newWindow = window.open();
      if (newWindow) {
        newWindow.document.write(`<img src="${dataUrl}" alt="QR Code" />`);
      } else {
        // Fallback: descarga automática
        const link = document.createElement("a");
        link.download = `qr-${rid}.png`;
        link.href = dataUrl;
        link.click();
      }
    } catch (err) {
      console.error("Error al generar la imagen:", err);
    }
  };


  const handleSubmitComment = async () => {
    if (!user || !token) {
      setShowCommentLoginMessage(true);
      return;
    }

    if (!newComment.trim()) return;

    setSubmitting(true);
    const res = await fetch(`${import.meta.env.VITE_API_BASE}/restaurants/${rid}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content: newComment })
    });

    if (res.ok) {
      const created = await res.json();
      setComments((prev) => [created, ...prev]);
      setNewComment("");
    }

    setSubmitting(false);
  };

  const handleDeleteComment = async (commentId) => {
    if (!user || !token) return;

    const res = await fetch(`${import.meta.env.VITE_API_BASE}/comments/${commentId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });

    if (res.ok) {
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    }
  };


  const handleToggleSave = () => {
    if (!user || !token) {
      setShowLoginMessage(true);
      return;
    }

    fetch(`${import.meta.env.VITE_API_BASE}/restaurants/${rid}/save`, {
      method: saved ? "DELETE" : "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(() => setSaved(!saved));
  };

  if (!restaurant) return null;

  const groupedMenu = {};
  restaurant.menu.forEach((item) => {
    if (Array.isArray(item.categories)) {
      item.categories.forEach((cat) => {
        if (!groupedMenu[cat]) groupedMenu[cat] = [];
        groupedMenu[cat].push(item);
      });
    } else {
      const cat = item.category || "Otros";
      if (!groupedMenu[cat]) groupedMenu[cat] = [];
      groupedMenu[cat].push(item);
    }
  });



  return (
    <div className="bg-neutral-800 p-8 rounded-2xl shadow-xl text-white space-y-6 w-full max-w-7xl mx-auto px-4">
      <h2 className="text-4xl font-bold">{restaurant.name}</h2>

      {restaurant.image && (
        <div className="w-48 h-48 mx-auto mt-4 rounded-full overflow-hidden shadow-md bg-neutral-700">
          <img
            src={`${import.meta.env.VITE_API_BASE}/img/restaurant/${restaurant.image}`}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <p className="text-lg text-gray-300">
        <span className="font-semibold text-gray-200">Ubicación:</span> {restaurant.address}
      </p>

      {restaurant.description && (
        <p className="text-base text-gray-400">{restaurant.description}</p>
      )}

      {restaurant.maps && (
        <div className="mt-4">
          <iframe
            src={restaurant.maps}
            className="w-full h-[250px] rounded-xl"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      )}

      {restaurant.specialties?.length > 0 && (
        <div>
          <h3 className="text-2xl font-semibold mt-6">Especialidades</h3>
          <ul className="mt-2 flex flex-col lg:flex-row lg:flex-wrap gap-2 text-gray-300 list-disc list-inside lg:list-none">
            {restaurant.specialties.map((item, idx) => (
              <li key={idx} className="lg:before:content-['•'] lg:before:mr-2 lg:list-none">
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4 space-y-2">
        <button
          onClick={handleToggleSave}
          className={`px-4 py-2 rounded font-semibold transition ${saved ? "bg-gray-600 hover:bg-gray-500" : "bg-red-600 hover:bg-red-500"
            }`}
        >
          {saved ? "Quitar de favoritos" : "Guardar restaurante"}
        </button>
        {showLoginMessage && (
          <p className="text-sm text-red-400">Debes iniciar sesión para guardar restaurantes.</p>
        )}
      </div>

      <div className="space-y-10 mt-6">
        {Object.entries(groupedMenu).map(([category, items]) => (
          <div key={category}>
            <h3 className="text-2xl font-semibold text-white mb-4">{category}</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {items.map((item) => (
                <div key={item.id} className="space-y-1 bg-neutral-700 p-4 rounded-xl">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-white">{item.name}</span>
                    <span className="text-sm text-gray-400">
                      ${parseFloat(item.price).toFixed(2)}
                    </span>
                  </div>
                  {item.description && (
                    <p className="text-sm text-gray-400">{item.description}</p>
                  )}
                  {Array.isArray(item.tags) && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {item.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-red-600 text-white px-2 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 space-y-4">
        <h3 className="text-2xl font-semibold text-white">Deja un comentario</h3>
        <textarea
          className="w-full p-3 bg-neutral-700 text-white rounded-xl focus:outline-none focus:ring focus:ring-red-500"
          rows={3}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Escribe tu opinión sobre este restaurante..."
        />
        <button
          onClick={handleSubmitComment}
          disabled={submitting}
          className="bg-red-600 hover:bg-red-500 transition-colors text-white font-semibold py-2 px-6 rounded-xl"
        >
          {submitting ? "Enviando..." : "Publicar comentario"}
        </button>
        {showCommentLoginMessage && (
          <p className="text-sm text-red-400">Debes iniciar sesión para dejar un comentario.</p>
        )}
      </div>

      {comments.length > 0 && (
        <div className="mt-10">
          <h3 className="text-2xl font-semibold text-white mb-4">Comentarios</h3>
          <div className="space-y-4">
            {comments.map((c) => (
              <div key={c.id} className="bg-neutral-700 p-4 rounded-xl shadow-md text-white space-y-1">
                <div className="flex items-center gap-3">
                  <img src={`${import.meta.env.VITE_API_BASE}/img/user/${c.avatar}`} alt={c.user_name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="font-medium text-white">{c.user_name}</p>
                    <p className="text-xs text-gray-400">{new Date(c.created_at).toLocaleString()}</p>
                  </div>
                  {user?.name === c.user_name && (
                    <button
                      onClick={() => handleDeleteComment(c.id)}
                      className="text-sm text-red-400 hover:text-red-300 ml-auto"
                    >
                      Eliminar
                    </button>
                  )}
                </div>
                <p className="text-sm text-gray-300 mt-2">{c.content}</p>
              </div>
            ))}

          </div>
        </div>
      )}

      <div className="mt-10 text-center space-y-4">
        <h3 className="text-lg font-semibold text-gray-300">Escanea el QR para compartir</h3>

        {finalImage ? (
          <img
            src={finalImage}
            alt="QR compuesto"
            className="rounded-2xl border-[6px] border-red-600 bg-red-600 inline-block"
          />
        ) : (
          <div
            ref={qrRef}
            className="inline-block border-[6px] border-red-600 bg-red-600 rounded-2xl overflow-hidden"
            style={{ width: "max-content" }}
          >
            <div className="bg-white p-3">
              <div className="relative w-[260px] h-[260px]">
                <QRCodeCanvas value={restaurantUrl} size={260} onRendered={() => setQrReady(true)} />
                <img
                  src="/logo_qr.png"
                  alt="Logo"
                  onLoad={() => setLogoReady(true)}
                  className="w-12 h-12 object-contain absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                />

              </div>
            </div>
            <div className="bg-red-600 text-white py-3 px-4 text-center space-y-1">
              <p className="text-base font-semibold">{restaurant.name}</p>
              <p className="text-sm font-light tracking-wide">GDLHUB</p>
            </div>
          </div>
        )}

        <p className="text-sm text-gray-400">
          Mantén presionado para guardar el QR
        </p>
      </div>

    </div>
  );
}
