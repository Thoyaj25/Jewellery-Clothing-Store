export default function SpotifySection() {
  return (
    <section className="py-16 px-6 border-t border-zinc-800">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-light text-white mb-4">
          🎵 Shop With Music
        </h2>

        <p className="text-gray-400 mb-8">
          Enjoy our curated luxury playlist while browsing
          Ultimate Collections.
        </p>

        <iframe
          style={{ borderRadius: "12px" }}
          src="https://open.spotify.com/embed/playlist/14wKPkpftkc2jAnR4cODQl"
          width="100%"
          height="152"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        />
      </div>
    </section>
  );
}