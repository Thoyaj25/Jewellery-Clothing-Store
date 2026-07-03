export default function InstagramSection() {
  return (
    <section className="py-16 mt-20 border-t border-amber-600/20 bg-gradient-to-b from-amber-950/10 to-black">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <div className="inline-block">
          <div className="text-4xl mb-4">📸</div>
          <h2 className="text-3xl md:text-4xl font-light text-white mb-2">
            Follow Us On Instagram
          </h2>
          <p className="text-gray-400 mb-2">@ultimate_collections</p>
          <p className="text-gray-500 text-sm mb-6">
            See our latest collections and customer photos
          </p>

          <a
            href="https://instagram.com/ultimate_collections"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-gradient-to-r from-pink-500 to-amber-400 hover:from-pink-600 hover:to-amber-500 text-black font-light px-8 py-3 rounded transition-all hover:shadow-lg hover:shadow-pink-500/20"
          >
            View Our Instagram →
          </a>
        </div>

        {/* Instagram Feed Preview */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="aspect-square bg-gradient-to-br from-amber-600/20 to-pink-600/20 rounded-lg border border-amber-600/20 flex items-center justify-center hover:border-amber-600/40 transition-colors cursor-pointer"
            >
              <span className="text-4xl">✨</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
