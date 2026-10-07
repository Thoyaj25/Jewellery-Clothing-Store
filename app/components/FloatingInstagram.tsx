"use client";

import { InstagramIcon } from "@/app/components/SocialIcons";

export default function FloatingInstagram() {
  return (
    <a
      href="https://instagram.com/durgapj.badri"
      target="_blank"
      rel="noopener noreferrer"
      className="
        fixed bottom-28 right-6
        z-50
        w-14 h-14
        rounded-full
        bg-gradient-to-tr from-purple-600 via-pink-500 to-orange-400
        flex items-center justify-center
        shadow-lg
        hover:scale-110
        transition-transform
      "
      aria-label="Instagram"
    >
      <InstagramIcon className="h-7 w-7 text-white" />
    </a>
  );
}