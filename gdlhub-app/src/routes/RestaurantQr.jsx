import QRCode from "qrcode";
import { useEffect, useState } from "react";

export default function RestaurantQR({ restaurantUrl, restaurant }) {
  const [qrImage, setQrImage] = useState("");

  useEffect(() => {
    QRCode.toDataURL(restaurantUrl, { width: 300, margin: 0 }, (err, url) => {
      if (!err) setQrImage(url);
    });
  }, [restaurantUrl]);

  if (!qrImage) return null;

  return (
    <div className="mt-10 text-center space-y-4">
      <h3 className="text-lg font-semibold text-gray-300">Escanea el QR para compartir</h3>

      <div
        className="inline-block border-[6px] border-red-600 bg-red-600 rounded-2xl overflow-hidden"
      >
        <div className="bg-white p-3">
          <div className="relative w-[260px] h-[260px]">
            <img
              src={qrImage}
              alt="QR Code"
              className="w-full h-full object-contain"
            />
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

      <p className="text-sm text-gray-400">Mantén presionado para guardar el código QR</p>
    </div>
  );
}
