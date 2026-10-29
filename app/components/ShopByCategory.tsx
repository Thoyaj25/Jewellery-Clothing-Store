import Image from "next/image";
import Link from "next/link";

export default function ShopByCategory() {
  const categories = [
    { name: "Jewellery", image: "/products/jewellery/gold-necklace.jpeg" },
    { name: "Handbags", image: "/products/handbags/designer-clutch.jpeg" },
    { name: "Sarees", image: "/products/sarees/red-saree.jpeg" },
    { name: "Kurtis", image: "/products/kurtis/cotton-kurti3.jpeg" },
  ];

  return (
    <section className="scroll-mt-28 py-16 mt-20 border-t border-amber-600/20 bg-gradient-to-b from-amber-950/10 to-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-light text-white mb-2">
            Shop By Category
          </h2>

          <p className="text-gray-400">
            Discover our premium collections for every occasion
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={`/products?category=${encodeURIComponent(category.name)}`}
              className="group relative block overflow-hidden rounded-xl border border-amber-600/20 transition-all duration-300 hover:border-amber-500/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
              aria-label={`Shop ${category.name}`}
            >
              <Image
                src={category.image}
                alt={category.name}
                width={400}
                height={400}
                className="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/55 to-transparent px-3 pb-4 pt-12 text-center">
                <span className="font-serif text-lg font-medium text-white sm:text-xl">
                  {category.name}
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/jewellery"
            className="inline-block bg-gradient-to-r from-amber-500 to-yellow-400 text-black px-8 py-3 rounded font-medium"
          >
            Explore Collections →
          </Link>
        </div>
      </div>
    </section>
  );
}