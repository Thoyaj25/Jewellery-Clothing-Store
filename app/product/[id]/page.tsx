import Image from "next/image";
import sql from "@/src/lib/db";
import AddToCart from "@/app/components/AddToCart";
import OrderButtons from "@/app/components/OrderButtons";

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
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">
            Invalid Product
          </h1>
          <p className="text-gray-400">
            The requested product ID is invalid.
          </p>
        </div>
      </div>
    );
  }

  const result = await sql`
    SELECT
      id,
      name,
      category,
      price,
      image,
      description
    FROM products
    WHERE id = ${productId}
    LIMIT 1
  `;

  const product = result[0];

  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">
            Product Not Found
          </h1>
          <p className="text-gray-400">
            We could not find the requested product.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 md:py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        <div>
          <Image
            src={product.image}
            alt={product.name}
            width={600}
            height={600}
            priority
            className="w-full h-[300px] sm:h-[420px] object-cover rounded-lg"
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

          <p className="mt-6 text-gray-300 leading-relaxed">
            {product.description}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">

            <AddToCart
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
            />

          </div>

        </div>
      </div>
    </div>
  );
}