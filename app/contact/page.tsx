export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black py-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-14">
          <h1 className="text-5xl font-light text-white mb-4">
            Contact Us
          </h1>

          <p className="text-zinc-400 text-lg">
            We&apos;d love to hear from you. Reach out for enquiries, orders, or
            product information.
          </p>
        </div>

        {/* Contact Card */}
        <div className="bg-zinc-900/80 backdrop-blur-lg border border-amber-600/20 rounded-3xl shadow-2xl overflow-hidden md:grid md:grid-cols-2">
          {/* Left Side */}
          <div className="p-8 bg-gradient-to-b from-zinc-900 to-black border-b md:border-b-0 md:border-r border-amber-600/20">
            <h2 className="text-3xl text-white mb-10 font-light">
              Get In Touch
            </h2>

            <div className="space-y-8">
              {/* Store Address */}
              <div>
                <p className="text-amber-500 text-sm uppercase tracking-wider mb-2">
                  📍 Store Address
                </p>

                <p className="text-zinc-300 leading-7">
                  Ultimate Collections
                  <br />
                  5/200, KPT Street,
                  <br />
                  Venkatagirikota,
                  <br />
                  Chittoor District,
                  <br />
                  Andhra Pradesh – 517424,
                  <br />
                  India 🇮🇳
                </p>

                <a
                  href="https://www.google.com/maps/search/?api=1&query=5/200,KPT+Street,Venkatagirikota,Chittoor,Andhra+Pradesh+517424"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 px-5 py-2 bg-amber-600 text-black rounded-lg font-medium hover:bg-amber-500 transition"
                >
                  📍 View on Google Maps
                </a>
              </div>

              {/* Phone */}
              <div>
                <p className="text-amber-500 text-sm uppercase tracking-wider mb-2">
                  📞 Phone
                </p>

                <a
                  href="tel:9490731606"
                  className="text-zinc-300 hover:text-amber-500 transition"
                >
                  +91 94907 31606
                </a>
              </div>

              {/* Email */}
              <div>
                <p className="text-amber-500 text-sm uppercase tracking-wider mb-2">
                  ✉️ Email
                </p>

                <a
                  href="mailto:durgapj.badri@gmail.com"
                  className="text-zinc-300 hover:text-amber-500 transition break-all"
                >
                  durgapj.badri@gmail.com
                </a>
              </div>

              {/* Business Hours */}
              <div>
                <p className="text-amber-500 text-sm uppercase tracking-wider mb-2">
                  🕒 Business Hours
                </p>

                <p className="text-zinc-300">
                  Monday – Sunday
                  <br />
                  9:00 AM – 9:00 PM IST
                </p>
              </div>

              <p className="text-zinc-500 text-sm">
                Online Orders Delivered Across India 🇮🇳
              </p>
            </div>
          </div>

          {/* Right Side */}
          <div className="p-8">
            <h2 className="text-3xl text-white mb-10 font-light">
              Send an Enquiry
            </h2>

            <form
              action="https://formsubmit.co/durgapj.badri@gmail.com"
              method="POST"
              className="space-y-5"
            >
              <input
                type="hidden"
                name="_captcha"
                value="false"
              />

              <input
                type="hidden"
                name="_subject"
                value="New Enquiry from Ultimate Collections"
              />

              <input
                type="hidden"
                name="_next"
                value="https://jewellery-clothing-store-2gop24zdn.vercel.app/contact"
              />

              <input
                type="text"
                name="name"
                placeholder="Your Name"
                required
                className="w-full bg-black/40 border border-zinc-700 rounded-xl p-4 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
              />

              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                required
                className="w-full bg-black/40 border border-zinc-700 rounded-xl p-4 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
              />

              <input
                type="email"
                name="email"
                placeholder="Email Address (Optional)"
                className="w-full bg-black/40 border border-zinc-700 rounded-xl p-4 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
              />

              <textarea
                name="message"
                placeholder="Tell us what you're looking for..."
                rows={6}
                required
                className="w-full bg-black/40 border border-zinc-700 rounded-xl p-4 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
              />

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-600 to-amber-500 text-black py-4 rounded-xl font-semibold hover:from-amber-500 hover:to-amber-400 transition duration-300 shadow-lg hover:shadow-amber-600/30"
              >
                Send Enquiry
              </button>
            </form>
          </div>
        </div>

        {/* Google Maps Section */}
        <div className="mt-16">
          <h2 className="text-4xl text-white font-light text-center mb-8">
            Visit Our Store
          </h2>

          <div className="overflow-hidden rounded-3xl border border-amber-600/20 shadow-2xl">
            <iframe
              src="https://www.google.com/maps?q=5/200,KPT+Street,Venkatagirikota,Chittoor,Andhra+Pradesh+517424&output=embed"
              width="100%"
              height="400"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              title="Ultimate Collections Location"
            />
          </div>
        </div>
      </div>
    </div>
  );
}