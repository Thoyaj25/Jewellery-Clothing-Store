import Image from "next/image";
import { notFound } from "next/navigation";

import { getProducts } from "@/src/lib/getProducts";
import AddToCart from "@/app/components/AddToCart";
import OrderButtons from "@/app/components/OrderButtons";

export const dynamic = "force-static";

export async function generateStaticParams() {
  const products = await getProducts();

  return products.map((product) => ({
    id: product.id.toString(),
  }));
}

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