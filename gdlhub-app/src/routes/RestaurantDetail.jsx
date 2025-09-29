import { useParams, Link } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import { toPng } from "html-to-image";
import { useRef, useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { getAvatarUrl } from "../utils/avatarUtils";
import { getRestaurantImageUrl, getDishImageUrl } from "../utils/imageUtils";

export default function RestaurantDetail() {
  const { rid } = useParams();
  const publicUrl = import.meta.env.VITE_PUBLIC_URL;
  const restaurantUrl = `${publicUrl}/restaurants/${rid}`;
  const qrRef = useRef(null);

  const [restaurant, setRestaurant] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [showRatingMessage, setShowRatingMessage] = useState(false);
  const [showLoginMessage, setShowLoginMessage] = useState(false);
  const [showCommentLoginMessage, setShowCommentLoginMessage] = useState(false);


  const [finalImage, setFinalImage] = useState(null);
  const [showOriginalQR, setShowOriginalQR] = useState(true);

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);


  const { user, token, refreshRecommendations } = useUser();

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

  useEffect(() => {
    if (!user || !token) return;
    fetch(`${import.meta.env.VITE_API_BASE}/restaurants/${rid}/rating`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setUserRating(data.rating || 0));
  }, [rid, user, token]);

  useEffect(() => {
    if (!isMobile) return;
    let attempts = 0;
    const maxAttempts = 4; // 4 intentos (5s * 4 = 20s)

    const interval = setInterval(() => {
      attempts += 1;
      handleDownload();
      if (attempts >= maxAttempts) {
        clearInterval(interval);
        setShowOriginalQR(false); // ⬅️ ocultar el original QR
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [restaurant]);



  const handleDownload = async () => {
    if (!qrRef.current) return;
    try {
      const dataUrl = await toPng(qrRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        skipFonts: true,
      });

      if (isMobile) {
        setFinalImage(dataUrl); // mostrará imagen que se puede mantener presionada
      } else {
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
    }).then(() => {
      setSaved(!saved);
      refreshRecommendations(); // Actualizar recomendaciones cuando cambia el estado de guardado
    });
  };

  const handleRating = (rating) => {
    if (!user || !token) {
      setShowRatingMessage(true);
      setTimeout(() => setShowRatingMessage(false), 3000);
      return;
    }

    fetch(`${import.meta.env.VITE_API_BASE}/restaurants/${rid}/rating`, {
      method: userRating === rating ? "DELETE" : "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ rating }),
    }).then(() => {
      setUserRating(userRating === rating ? 0 : rating);
      refreshRecommendations(); // Actualizar recomendaciones cuando cambia la calificación
      // Recargar los datos del restaurante para actualizar el promedio
      fetch(`${import.meta.env.VITE_API_BASE}/restaurants/${rid}`)
        .then(res => res.json())
        .then(setRestaurant);
    });
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
      <div className="space-y-3">
        <h2 className="text-4xl font-bold">{restaurant.name}</h2>
        
        {/* Calificación promedio */}
        {restaurant.avg_rating > 0 ? (
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <span className="text-2xl text-yellow-400">⭐</span>
              <span className="text-xl font-semibold ml-1">{restaurant.avg_rating}</span>
            </div>
            <span className="text-gray-400">
              ({restaurant.total_ratings} {restaurant.total_ratings === 1 ? 'calificación' : 'calificaciones'})
            </span>
          </div>
        ) : (
          <p className="text-gray-400">Sin calificaciones aún</p>
        )}
      </div>

      {restaurant.image && (
        <div className="w-48 h-48 mx-auto mt-4 rounded-full overflow-hidden shadow-md bg-neutral-700">
          <img
            src={getRestaurantImageUrl(restaurant.image)}
            alt={restaurant.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              console.log('❌ Error cargando imagen de restaurante:', restaurant.image);
              e.target.style.display = 'none';
            }}
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

      <div className="mt-4 space-y-4">
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

        {/* Sistema de calificación */}
        <div className="bg-neutral-800 p-4 rounded-xl">
          <h4 className="text-lg font-semibold text-white mb-3">Califica este restaurante</h4>
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleRating(star)}
                className={`text-3xl transition-all duration-200 transform hover:scale-110 ${
                  star <= userRating 
                    ? "text-yellow-400 drop-shadow-lg" 
                    : "text-gray-600 hover:text-gray-400"
                }`}
                style={{
                  filter: star <= userRating ? 'brightness(1.2) contrast(1.1)' : 'brightness(0.7)',
                  textShadow: star <= userRating ? '0 0 8px rgba(255, 193, 7, 0.6)' : 'none'
                }}
              >
                ⭐
              </button>
            ))}
            <div className="ml-4 flex flex-col">
              {userRating > 0 ? (
                <>
                  <span className="text-sm font-semibold text-white">
                    Tu calificación: {userRating}/5
                  </span>
                  <span className="text-xs text-gray-400">
                    Haz clic en la misma estrella para quitar
                  </span>
                </>
              ) : (
                <span className="text-sm text-gray-400">
                  Selecciona las estrellas para calificar
                </span>
              )}
            </div>
          </div>
          {showRatingMessage && (
            <p className="text-sm text-red-400 mt-2">Debes iniciar sesión para calificar restaurantes.</p>
          )}
        </div>
      </div>

      <div className="space-y-10 mt-6">
        {Object.entries(groupedMenu).map(([category, items]) => (
          <div key={category}>
            <h3 className="text-2xl font-semibold text-white mb-4">{category}</h3>
            <div className="space-y-3 sm:space-y-4">
              {items.map((item) => (
                <div key={item.id} className="bg-neutral-700 p-3 sm:p-4 rounded-lg sm:rounded-xl">
                  <div className="flex gap-2 sm:gap-4">
                    {/* Imagen del platillo a la izquierda */}
                    <div className="flex-shrink-0">
                      {item.image ? (
                        <img
                          src={getDishImageUrl(item.image)}
                          alt={item.name}
                          className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 object-cover rounded-lg border border-neutral-600"
                          onError={(e) => {
                            console.log('❌ Error cargando imagen de platillo:', item.image);
                            e.target.style.display = 'none';
                            e.target.parentNode.innerHTML = '<div class="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-neutral-600 rounded-lg border border-neutral-500 flex items-center justify-center"><span class="text-gray-400 text-xl sm:text-2xl">🍽️</span></div>';
                          }}
                        />
                      ) : (
                        <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-neutral-600 rounded-lg border border-neutral-500 flex items-center justify-center">
                          <span className="text-gray-400 text-xl sm:text-2xl">🍽️</span>
                        </div>
                      )}
                    </div>

                    {/* Información del platillo a la derecha */}
                    <div className="flex-1 space-y-1 sm:space-y-2 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-white text-sm sm:text-base lg:text-lg truncate">{item.name}</h4>
                        <span className="text-sm sm:text-base lg:text-lg font-semibold text-green-400 ml-2 flex-shrink-0">
                          ${parseFloat(item.price).toFixed(2)}
                        </span>
                      </div>
                      
                      {item.description && (
                        <p className="text-gray-300 text-xs sm:text-sm leading-relaxed line-clamp-2">{item.description}</p>
                      )}
                      
                      {Array.isArray(item.tags) && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 sm:gap-2">
                          {item.tags.slice(0, 3).map((tag, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-red-600/20 border border-red-500 text-red-300 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                          {item.tags.length > 3 && (
                            <span className="text-xs text-gray-400">+{item.tags.length - 3} más</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
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
                  <img src={getAvatarUrl(c.avatar)} alt={c.user_name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <Link 
                      to={`/users/${c.user_id}`} 
                      className="font-medium text-white hover:text-red-400 transition-colors"
                    >
                      {c.user_name}
                    </Link>
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
        {showOriginalQR && (
          <div
            ref={qrRef}
            onClick={handleDownload}
            className="inline-block cursor-pointer border-[6px] border-red-600 bg-red-600 rounded-2xl overflow-hidden"
            style={{ width: "max-content" }}
          >
            <div className="bg-white p-3">
              <div className="relative w-[210px] sm:w-[260px] h-[210px] sm:h-[260px]">
                <QRCodeCanvas value={restaurantUrl} size={window.innerWidth < 640 ? 210 : 260} />
                <img
                  src="/logo_qr.png"
                  alt="Logo"
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

        <p className="text-sm text-gray-400">Toca el codigo QR para descargar</p>
        {isMobile && finalImage && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400 mb-2">Mantén presionado para guardar en tu galería</p>
            <img
              src={finalImage}
              alt="QR para guardar"
              className="w-[210px] sm:w-[260px] h-auto mx-auto rounded-xl shadow-md"
            />
          </div>
        )}

      </div>
    </div>
  );
}
