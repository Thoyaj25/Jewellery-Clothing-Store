export default function Testimonials() {
  const testimonials = [
    {
      name: "Priya Sharma",
      location: "Bangalore",
      rating: 5,
      text: "Beautiful jewellery and excellent customer service. The quality exceeded my expectations!",
    },
    {
      name: "Kavya Nair",
      location: "Chennai",
      rating: 5,
      text: "Very good quality and super fast delivery. Highly recommended for festival shopping!",
    },
    {
      name: "Anjali Patel",
      location: "Delhi",
      rating: 5,
      text: "Amazing collection of sarees and kurtis. Love the designs and the affordability.",
    },
    {
      name: "Neha Gupta",
      location: "Mumbai",
      rating: 5,
      text: "Perfect for weddings! The jewellery looks so elegant. Will definitely order again.",
    },
  ];

  return (
    <section className="py-16 mt-20 border-t border-amber-600/20">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-light text-center text-white mb-4">
          Loved By Customers
        </h2>
        <p className="text-center text-gray-400 mb-12">
          Real reviews from real customers
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, i) => (
            <div
              key={i}
              className="bg-amber-950/10 border border-amber-600/20 rounded-lg p-6 hover:border-amber-600/40 transition-colors"
            >
              {/* Star Rating */}
              <div className="flex gap-1 mb-3">
                {[...Array(testimonial.rating)].map((_, j) => (
                  <span key={j} className="text-amber-400">
                    ⭐
                  </span>
                ))}
              </div>

              {/* Quote */}
              <p className="text-gray-300 text-sm mb-4 italic">
                &ldquo;{testimonial.text}&rdquo;
              </p>

              {/* Name & Location */}
              <div>
                <p className="text-white font-light text-sm">
                  {testimonial.name}
                </p>
                <p className="text-gray-500 text-xs">
                  {testimonial.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
