export default function ShopByCategory() {
  const images = [
    "/products/jewellery/gold-necklace.jpeg",
    "/products/handbags/designer-clutch.jpeg",
    "/products/sarees/red-saree.jpeg",
    "/products/kurtis/cotton-kurti3.jpeg",
  ];

  return (
    <section className="py-16 mt-20 border-t border-amber-600/20 bg-gradient-to-b from-amber-950/10 to-black">
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
          {images.map((image, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-xl border border-amber-600/20"
            >
              <img
                src={image}
                alt={`Category ${index + 1}`}
                className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <a
            href="/jewellery"
            className="inline-block bg-gradient-to-r from-amber-500 to-yellow-400 text-black px-8 py-3 rounded font-medium"
          >
            Explore Collections →
          </a>
        </div>
      </div>
    </section>
  );
}