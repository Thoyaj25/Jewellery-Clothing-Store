import Link from "next/link";

const stories = [
  {
    city: "Hyderabad",
    category: "Jewellery",
    title: "Timeless Elegance",
    description: "Traditional charm meets contemporary jewellery styling.",
  },
  {
    city: "Bengaluru",
    category: "Kurtis",
    title: "Modern Chic",
    description: "Versatile accessories for effortless everyday fashion.",
  },
  {
    city: "Mumbai",
    category: "Handbags",
    title: "Glamour & Style",
    description: "Statement pieces inspired by bold, expressive fashion.",
  },
  {
    city: "Visakhapatnam",
    category: "Sarees",
    title: "Coastal Elegance",
    description: "Graceful festive looks with a refreshing modern touch.",
  },
];

export default function StyleStoriesIndia() {
  return (
    <section
      aria-labelledby="style-stories-title"
      className="border-t border-amber-600/20 py-16 md:py-20"
    >
      <div className="mx-auto max-w-7xl px-6">
        <p className="mb-3 text-center text-xs uppercase tracking-[0.3em] text-amber-400">
          Inspired By Indian Fashion
        </p>

        <h2
          id="style-stories-title"
          className="text-center text-3xl font-light text-white md:text-4xl"
        >
          Style Stories Across India
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-7 text-gray-400">
          Discover fashion inspiration celebrating elegance,
          individuality, and timeless Indian style.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stories.map((story) => (
            <Link
              key={story.city}
              href={`/products?category=${encodeURIComponent(story.category)}`}
              aria-label={`Explore ${story.category} inspired by ${story.city}`}
              className="block rounded-2xl border border-amber-600/20 bg-gradient-to-b from-amber-950/20 to-black p-6 text-center transition-colors hover:border-amber-500/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-amber-400">
                {story.city}
              </p>

              <h3 className="mt-4 text-xl font-light text-white">
                {story.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-400">
                {story.description}
              </p>

              <span className="mt-5 inline-block text-sm font-medium text-amber-400">
                Explore {story.category} →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
