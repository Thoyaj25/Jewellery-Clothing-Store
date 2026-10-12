"use client";

import { useEffect, useState } from "react";
import { WhatsAppIcon } from "@/app/components/SocialIcons";
import { usePathname } from "next/navigation";

export default function FloatingWhatsApp() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible || /^\/product\/[^/]+\/?$/.test(pathname)) return null;

  return (
    <a
      href="https://wa.me/919490731606?text=Hello%20Ultimate%20Collections%21%20I%20would%20like%20to%20know%20more%20about%20your%20products"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-4 sm:right-6 z-50"
      aria-label="Chat with us on WhatsApp"
    >
      <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-2xl hover:bg-green-600 transition-all duration-300 transform hover:scale-110">
        <WhatsAppIcon className="h-7 w-7 text-white" />
      </div>
    </a>
  );
}
