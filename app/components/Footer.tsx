import {
  InstagramIcon,
  FacebookIcon,
  WhatsAppIcon,
} from "./SocialIcons";

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
          ✉️ prasadpj509@gmail.com
        </p>

        <nav
          aria-label="Follow Ultimate Collections"
          className="mt-6 flex flex-wrap justify-center gap-6"
        >
          {[
            {
              name: "Instagram",
              href: "https://instagram.com/durgapj.badri",
              color: "bg-gradient-to-tr from-purple-600 via-pink-500 to-orange-400",
              Icon: InstagramIcon,
            },
            {
              name: "Facebook",
              href: "https://www.facebook.com/durgapj.badri9974",
              color: "bg-[#1877F2]",
              Icon: FacebookIcon,
            },
            {
              name: "WhatsApp",
              href: "https://wa.me/919490731606",
              color: "bg-[#25D366]",
              Icon: WhatsAppIcon,
            },
          ].map(({ name, href, color, Icon }) => (
            <a
              key={name}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Ultimate Collections on ${name}`}
              className="group flex min-w-16 flex-col items-center gap-2 text-xs text-gray-300"
            >
              <span
                className={`flex h-12 w-12 items-center justify-center rounded-full text-white shadow-md transition-transform group-hover:scale-110 group-focus-visible:outline group-focus-visible:outline-2 group-focus-visible:outline-amber-400 ${color}`}
              >
                <Icon className="h-6 w-6" />
              </span>
              <span>{name}</span>
            </a>
          ))}
        </nav>

        <nav
          aria-label="Store policies"
          className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm"
        >
          <a href="/shipping-policy" className="text-gray-400 hover:text-amber-400">
            Shipping & Delivery
          </a>
          <a href="/returns-refunds" className="text-gray-400 hover:text-amber-400">
            Returns & Refunds
          </a>
          <a href="/privacy-policy" className="text-gray-400 hover:text-amber-400">
            Privacy Policy
          </a>
          <a href="/terms-conditions" className="text-gray-400 hover:text-amber-400">
            Terms & Conditions
          </a>
        </nav>

        <div className="mt-6 text-gray-600 text-xs">
          © {new Date().getFullYear()} Ultimate Collections.
          All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}