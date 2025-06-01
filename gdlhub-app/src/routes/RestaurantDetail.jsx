import { useLoaderData } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import { toPng } from "html-to-image";
import { useRef } from "react";

export default function RestaurantDetail() {
  const restaurant = useLoaderData();
  const publicUrl = import.meta.env.VITE_PUBLIC_URL;
  const restaurantUrl = `${publicUrl}/restaurants/${restaurant.id}`;
  const qrRef = useRef(null);

  const handleDownload = async () => {
    if (!qrRef.current) return;
    try {
      const dataUrl = await toPng(qrRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        skipFonts: true,
      });
      const link = document.createElement("a");
      link.download = `qr-${restaurant.id}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Error al generar la imagen:", err);
    }
  };

  // Agrupar menú por categoría
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

      <p className="text-lg text-gray-300">
        <span className="font-semibold text-gray-200">Ubicación:</span>{" "}
        {restaurant.address}
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
              <li
                key={idx}
                className="lg:before:content-['•'] lg:before:mr-2 lg:list-none"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* MENÚ agrupado por categoría */}
      <div className="space-y-10 mt-6">
        {Object.entries(groupedMenu).map(([category, items]) => (
          <div key={category}>
            <h3 className="text-2xl font-semibold text-white mb-4">
              {category}
            </h3>
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

      {/* QR con logo y fondo rojo */}
      <div className="mt-10 text-center space-y-4">
        <h3 className="text-lg font-semibold text-gray-300">Escanea el QR para compartir</h3>

        <div
          ref={qrRef}
          onClick={handleDownload}
          className="inline-block cursor-pointer border-[6px] border-red-600 bg-red-600 rounded-2xl overflow-hidden"
          style={{ width: "max-content" }}
        >
          <div className="bg-white p-3">
            <div className="relative w-[300px] h-[300px]">
              <QRCodeCanvas value={restaurantUrl} size={300} />
              <img
                src="/logo_qr.png"
                alt="Logo"
                className="w-16 h-16 object-contain absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              />
            </div>
          </div>
          <div className="bg-red-600 text-white py-3 px-4 text-center space-y-1">
            <p className="text-base font-semibold">{restaurant.name}</p>
            <p className="text-sm font-light tracking-wide">GDLHUB</p>
          </div>
        </div>

        <p className="text-sm text-gray-400">Mantén pulsado para compartir o toca para descargar</p>
      </div>
    </div>
  );
}
