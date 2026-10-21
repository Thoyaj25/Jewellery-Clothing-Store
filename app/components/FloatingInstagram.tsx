"use client";

import { InstagramIcon } from "@/app/components/SocialIcons";
import { usePathname } from "next/navigation";

export default function FloatingInstagram() {
  const pathname = usePathname();
  if (/^\/product\/[^/]+\/?$/.test(pathname)) return null;

  return (
    <a
      href="https://instagram.com/durgapj.badri"
      target="_blank"
      rel="noopener noreferrer"
      className="
        !hidden sm:!flex fixed bottom-[100px] right-4 sm:right-6
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