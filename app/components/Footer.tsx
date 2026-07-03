export default function Footer() {
  return (
    <footer className="border-t border-amber-600/20 bg-black py-10 mt-20">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h3 className="text-xl text-white font-light mb-2">
          Ultimate Collections
        </h3>

        <p className="text-gray-400 text-sm">
          Premium Imitation Jewellery & Fashion Wear
        </p>

        <p className="text-gray-500 text-sm mt-4">
          5/200, KPT Street, Venkatagirikota,
          <br />
          Chittoor, Andhra Pradesh - 517424
        </p>

        <p className="text-gray-500 text-sm mt-2">
          📞 +91 9490731606
        </p>

        <p className="text-gray-500 text-sm">
          ✉️ durgapj.badri@gmail.com
        </p>

        <div className="mt-6 text-gray-600 text-xs">
          © {new Date().getFullYear()} Ultimate Collections.
          All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}