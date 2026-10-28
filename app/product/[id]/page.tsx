import Image from "next/image";
import { notFound } from "next/navigation";

import { getProducts } from "@/src/lib/getProducts";
import AddToCart from "@/app/components/AddToCart";
import OrderButtons from "@/app/components/OrderButtons";
import WishlistButton from "@/app/components/WishlistButton";

export const dynamic = "force-dynamic";


type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProductById({ params }: Props) {
  const { id } = await params;
  const productId = Number(id);

  if (Number.isNaN(productId)) {
    notFound();
  }

  const products = await getProducts();
  const product = products.find((p) => p.id === productId);

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:py-12">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <Image
            src={product.image}
            alt={product.name}
            width={600}
            height={600}
            priority
            className="h-[300px] w-full rounded-lg object-cover sm:h-[420px]"
          />
        </div>

        <div className="flex flex-col">
          <p className="text-sm uppercase tracking-wide text-amber-500">
            {product.category}
          </p>

          <h1 className="mt-2 text-3xl font-bold text-white">
            {product.name}
          </h1>

          <p className="mt-4 text-3xl font-semibold text-amber-500">
            ₹{Number(product.price).toLocaleString("en-IN")}
          </p>

          {/* Product availability */}
          {product.stockQuantity != null && (
            <div className="mt-4">
              <span
                className={`inline-flex rounded-full border px-3 py-1.5 text-sm font-medium ${
                  product.stockQuantity === 0
                    ? "border-red-800/50 bg-red-950 text-red-300"
                    : product.stockQuantity <= 5
                      ? "border-amber-700/50 bg-amber-950 text-amber-300"
                      : "border-emerald-800/50 bg-emerald-950 text-emerald-300"
                }`}
              >
                {product.stockQuantity === 0
                  ? "Out of Stock"
                  : product.stockQuantity <= 5
                    ? `Only ${product.stockQuantity} Left`
                    : "In Stock"}
              </span>
            </div>
          )}

          <p className="mt-6 leading-relaxed text-gray-300">
            {product.description}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <AddToCart
              product={{
                id: product.id,
                name: product.name,
                price: Number(product.price),
                image: product.image,
                stockQuantity: product.stockQuantity,
              }}
            />

            <WishlistButton
              product={{
                id: product.id,
                name: product.name,
                price: Number(product.price),
                image: product.image,
              }}
            />

            <OrderButtons
              product={{
                id: product.id,
                name: product.name,
                price: Number(product.price),
              }}
              whatsappNumber={process.env.NEXT_PUBLIC_CONTACT_WHATSAPP}
              instagramHandle={process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE}
            />
          </div>
        </div>
      </div>
    </div>
  );
}