import Image from "next/image";
import sql from "@/src/lib/db";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProductById({ params }: Props) {
  const { id } = await params;

  const result = await sql`
    SELECT *
    FROM products
    WHERE id = ${Number(id)}
    LIMIT 1
  `;

  const prod = result[0];

  if (!prod) {
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
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8 md:py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <div>
          <Image
            src={prod.image}
            alt={prod.name}
            width={600}
            height={600}
            priority
            className="w-full h-[300px] sm:h-[380px] md:h-[420px] object-cover rounded-lg"
          />
        </div>

        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            {prod.name}
          </h1>

          <p className="mt-2 text-sm text-gray-400">
            {prod.category}
          </p>

          <p className="mt-4 text-2xl font-semibold text-amber-500">
            ₹{Number(prod.price).toLocaleString("en-IN")}
          </p>

          <p className="mt-4 text-gray-300 leading-relaxed">
            {prod.description}
          </p>

          <a
            href={`https://wa.me/9490731606`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block rounded-lg bg-green-500 text-white px-4 py-3 text-center font-medium hover:bg-green-600 transition-colors"
          >
            Order on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
