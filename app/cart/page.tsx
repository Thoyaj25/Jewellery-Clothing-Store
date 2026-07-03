import CartView from "../components/CartView";

export default function CartPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <CartView />
      </div>
    </div>
  );
}
