export default function WhyChooseUs() {
  const reasons = [
    {
      icon: "✨",
      title: "Premium Quality",
      description: "Handcrafted collections designed with attention to detail",
    },
    {
      icon: "🚀",
      title: "Fast Delivery",
      description: "Quick shipping across India with real-time tracking",
    },
    {
      icon: "🛡️",
      title: "Secure Payments",
      description: "Safe and encrypted payment gateway with multiple options",
    },
    {
      icon: "👥",
      title: "Trusted by Thousands",
      description: "Thousands of satisfied customers across the country",
    },
    {
      icon: "🎁",
      title: "Handmade Collections",
      description: "Exclusive designs crafted by skilled artisans",
    },
    {
      icon: "💬",
      title: "24/7 Support",
      description: "Quick response on WhatsApp and email support",
    },
  ];

  return (
    <section className="py-16 mt-20 border-t border-amber-600/20">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-light text-center text-white mb-4">
          Why Choose Ultimate Collections?
        </h2>
        <p className="text-center text-gray-400 mb-12">
          We deliver quality, style, and trust
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((reason, i) => (
            <div
              key={i}
              className="bg-amber-950/10 border border-amber-600/20 rounded-lg p-8 hover:border-amber-600/40 transition-all hover:bg-amber-950/20 group"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                {reason.icon}
              </div>
              <h3 className="text-xl font-light text-white mb-2">
                {reason.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
