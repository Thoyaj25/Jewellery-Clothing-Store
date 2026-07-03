"use client";

export default function FloatingInstagram() {
  return (
    <a
      href="https://instagram.com/durgapj.badri"
      target="_blank"
      rel="noopener noreferrer"
      className="
        fixed bottom-24 right-6
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
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="white"
        className="w-7 h-7"
      >
        <path d="M7.75 2C4.57 2 2 4.57 2 7.75v8.5C2 19.43 4.57 22 7.75 22h8.5C19.43 22 22 19.43 22 16.25v-8.5C22 4.57 19.43 2 16.25 2h-8.5zm0 1.5h8.5a4.25 4.25 0 014.25 4.25v8.5a4.25 4.25 0 01-4.25 4.25h-8.5a4.25 4.25 0 01-4.25-4.25v-8.5A4.25 4.25 0 017.75 3.5zm8.75 1a1 1 0 100 2 1 1 0 000-2zm-4.25 1.25A5.25 5.25 0 107.75 11 5.25 5.25 0 0012.25 5.75zm0 1.5A3.75 3.75 0 118.5 11a3.75 3.75 0 013.75-3.75z"/>
      </svg>
    </a>
  );
}