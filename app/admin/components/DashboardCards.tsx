import type { Product } from "@/src/types/product";

interface DashboardCardsProps {
  products: Product[];
}

export default function DashboardCards({
  products,
}: DashboardCardsProps) {
  const totalProducts = products.length;

  const categories = new Set(
    products.map((product) => product.category)
  ).size;

  const inventoryValue = products.reduce(
    (sum, product) => sum + product.price,
    0
  );

  const cards = [
    {
      title: "Products",
      value: totalProducts,
      color: "text-amber-400",
    },
    {
      title: "Categories",
      value: categories,
      color: "text-sky-400",
    },
    {
      title: "Inventory Value",
      value: `₹${inventoryValue.toLocaleString()}`,
      color: "text-emerald-400",
    },
    {
      title: "Status",
      value: "Online",
      color: "text-green-400",
    },
  ];

  return (
    <div className="mb-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-sm"
        >
          <p className="text-sm text-zinc-400">
            {card.title}
          </p>

          <h3 className={`mt-3 text-3xl font-bold ${card.color}`}>
            {card.value}
          </h3>
        </div>
      ))}
    </div>
  );
}
