"use client";

import Image from "next/image";
import { useCart } from "../context/CartProvider";

interface CartItemProps {
  id: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
}

export default function CartItem({
  id,
  name,
  price,
  image,
  quantity,
}: CartItemProps) {
  const { removeItem, updateQuantity } = useCart();

  const handleQuantityChange = (newQty: number) => {
    if (newQty > 0) {
      updateQuantity(id, newQty);
    }
  };

  const itemTotal = price * quantity;

  return (
    <div className="flex gap-4 pb-6 border-b border-zinc-700">
      {/* Product Image */}
      <div className="flex-shrink-0">
  <Image
    src={image || "/placeholder.jpg"}
    alt={name}
    width={96}
    height={96}
    className="w-24 h-24 object-cover rounded-lg bg-zinc-800"
  />
</div>

      {/* Product Details */}
      <div className="flex-grow">
        <h3 className="font-semibold text-lg text-white mb-2">
          {name}
        </h3>

        <p className="text-zinc-400 text-sm mb-3">
          ₹{price.toLocaleString("en-IN")} each
        </p>

        {/* Quantity Selector */}
        <div className="flex items-center gap-3 bg-zinc-800 w-fit rounded-lg p-1">
          <button
            onClick={() => handleQuantityChange(quantity - 1)}
            className="p-1.5 hover:bg-zinc-700 rounded transition-colors text-white"
            aria-label="Decrease quantity"
          >
            −
          </button>

          <span className="w-8 text-center font-medium text-white">
            {quantity}
          </span>

          <button
            onClick={() => handleQuantityChange(quantity + 1)}
            className="p-1.5 hover:bg-zinc-700 rounded transition-colors text-white"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      {/* Price & Remove */}
      <div className="flex flex-col items-end justify-between">
        <div>
          <p className="text-2xl font-bold text-white">
            ₹{itemTotal.toLocaleString("en-IN")}
          </p>
          <p className="text-xs text-zinc-500 mt-1">
            Qty: {quantity}
          </p>
        </div>

        <button
          onClick={() => removeItem(id)}
          className="text-red-500 hover:text-red-400 p-2 rounded-lg hover:bg-red-500/10 transition-colors text-sm"
          aria-label="Remove from cart"
        >
          🗑️ Remove
        </button>
      </div>
    </div>
  );
}
