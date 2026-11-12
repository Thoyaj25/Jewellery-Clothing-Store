export default function WhyChooseUs() {
  const reasons = [
    {
      icon: "✨",
      title: "Premium Quality",
      description: "Carefully selected jewellery, clothing and accessories",
    },
    {
      icon: "🚀",
      title: "Fast Delivery",
      description: "Delivery availability and estimated timelines confirmed for your PIN code",
    },
    {
      icon: "🛡️",
      title: "WhatsApp Order Assistance",
      description: "Our team confirms payment arrangements directly with you",
    },
    {
      icon: "👥",
      title: "Customer-Focused Service",
      description: "Personal assistance from enquiry to order confirmation",
    },
    {
      icon: "🎁",
      title: "Curated Fashion Collections",
      description: "Jewellery, clothing and accessories selected for your style",
    },
    {
      icon: "💬",
      title: "Daily Customer Support",
      description: "WhatsApp and phone support, 9 AM–9 PM IST",
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
