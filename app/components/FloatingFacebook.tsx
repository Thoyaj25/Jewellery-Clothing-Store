"use client";

import { FacebookIcon } from "@/app/components/SocialIcons";

export default function FloatingFacebook() {
  return (
    <a
      href="https://www.facebook.com/durgapj.badri9974"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Visit Ultimate Collections on Facebook"
      title="Facebook"
      style={{
        position: "fixed",
        right: "1.5rem",
        bottom: "11rem",
        zIndex: 60,
        width: "3.5rem",
        height: "3.5rem",
        backgroundColor: "#1877F2",
        color: "#ffffff",
        borderRadius: "9999px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)",
      }}
      className="transition-transform hover:scale-110"
    >
      <FacebookIcon className="h-7 w-7" />
    </a>
  );
}
