"use client";

import { useEffect, useState } from "react";
import { WhatsAppIcon } from "@/app/components/SocialIcons";

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
      className="fixed bottom-12 right-6 z-50 animate-bounce"
      aria-label="Chat with us on WhatsApp"
    >
      <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-2xl hover:bg-green-600 transition-all duration-300 transform hover:scale-110">
        <WhatsAppIcon className="h-8 w-8 text-white" />
      </div>
    </a>
  );
}
