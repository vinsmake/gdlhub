import { useLoaderData } from "react-router-dom";

export default function RestaurantDetail() {
  const restaurant = useLoaderData();

  return (
    <div className="bg-neutral-800 p-8 rounded-2xl shadow-xl text-white space-y-4 max-w-3xl mx-auto">
      <h2 className="text-4xl font-bold">{restaurant.name}</h2>
      <p className="text-lg text-gray-300">
        <span className="font-semibold text-gray-200">Ubicación:</span> {restaurant.location}
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
    </div>
  );
}
