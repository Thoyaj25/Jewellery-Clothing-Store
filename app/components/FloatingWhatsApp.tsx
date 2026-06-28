"use client";

import { useEffect, useState } from "react";

export default function FloatingWhatsApp() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <a
      href="https://wa.me/919490731606?text=Hello%20Ultimate%20Collections%21%20I%20would%20like%20to%20know%20more%20about%20your%20products"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-8 right-8 z-40 animate-bounce"
      aria-label="Chat with us on WhatsApp"
    >
      <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-2xl hover:bg-green-600 transition-all duration-300 transform hover:scale-110">
        <svg
          className="w-8 h-8 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.898 1.488c-1.502.881-2.797 2.219-3.643 3.866-1.032 1.917-1.459 4.088-1.206 6.196.141 1.161.455 2.297.967 3.363l-1.031 3.765 3.853-1.007c.994.547 2.05.861 3.132.866h.004c5.344 0 9.677-4.333 9.677-9.677 0-2.584-.994-5.013-2.802-6.82-1.809-1.809-4.236-2.802-6.82-2.802" />
        </svg>
      </div>
    </a>
  );
}
