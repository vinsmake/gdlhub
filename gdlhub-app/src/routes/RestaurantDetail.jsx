import { useLoaderData } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";

export default function RestaurantDetail() {
  const restaurant = useLoaderData();
  const publicUrl = import.meta.env.VITE_PUBLIC_URL;
  const restaurantUrl = `${publicUrl}/restaurants/${restaurant.id}`;

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
              <li key={idx} className="lg:before:content-['•'] lg:before:mr-2 lg:list-none">
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
        {restaurant.menu.map((item) => (
          <div key={item.id} className="space-y-1">
            <div className="flex justify-between">
              <span className="font-medium text-white">{item.name}</span>
              <span className="text-sm text-gray-400">
                ${parseFloat(item.price).toFixed(2)}
              </span>
            </div>
            <p className="text-sm text-gray-400 italic">{item.category}</p>
            {item.description && (
              <p className="text-sm text-gray-500">{item.description}</p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <h3 className="text-lg font-semibold text-gray-300 mb-2">Escanea el QR para compartir</h3>
        <div className="inline-block bg-white p-4 rounded-xl">
          <QRCodeCanvas value={restaurantUrl} size={180} />
        </div>
      </div>
    </div>
  );
}
