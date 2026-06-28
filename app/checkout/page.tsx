export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-4xl font-bold mb-6">
        Checkout
      </h1>

      <p className="mb-4">
        Thank you for shopping with Ultimate Collections.
      </p>

      <p>
        Online payment integration coming soon.
      </p>

      <a
        href="https://wa.me/919490731606"
        className="bg-green-500 px-6 py-3 rounded-lg inline-block mt-6"
      >
        Order on WhatsApp
      </a>
    </div>
  );
}
