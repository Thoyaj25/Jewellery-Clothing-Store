"use client";

import { usePathname } from "next/navigation";
import FloatingFacebook from "./FloatingFacebook";
import FloatingWhatsApp from "./FloatingWhatsApp";
import FloatingInstagram from "./FloatingInstagram";

export default function StorefrontFloatingSocials() {
  const pathname = usePathname();

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return null;
  }

  return (
    <>
      <FloatingFacebook />
      <FloatingWhatsApp />
      <FloatingInstagram />
    </>
  );
}
