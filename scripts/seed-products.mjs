import fs from "node:fs";
import path from "node:path";
import postgres from "postgres";

const envPath = path.resolve(process.cwd(), ".env.production.local");
if (!process.env.DATABASE_URL && fs.existsSync(envPath)) {
  const envContents = fs.readFileSync(envPath, "utf8");
  for (const line of envContents.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
      continue;
    }

    const [key, ...rest] = trimmed.split("=");
    const value = rest.join("=").replace(/^"/, "").replace(/"$/, "");
    if (key === "DATABASE_URL") {
      process.env.DATABASE_URL = value;
      break;
    }
  }
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("Missing DATABASE_URL environment variable");
}

const useSsl =
  process.env.NODE_ENV === "production" ||
  connectionString.includes("sslmode=require");

const sql = postgres(connectionString, {
  ssl: useSsl ? "require" : undefined,
  connect_timeout: 30,
  max: 1,
  idle_timeout: 20,
  prepare: false,
});

const products = [
  {
    name: "Designer Clutch",
    category: "Handbags",
    price: 3999,
    image: "/products/handbags/designer-clutch.jpeg",
    description: "Elegant designer clutch perfect for special occasions.",
  },
  {
    name: "Crunchu Multi Saree Party Wear",
    category: "Sarees",
    price: 1299,
    image: "/products/sarees/pink-saree.jpeg",
    description: "Beautiful pink saree.",
  },
  {
    name: "Rangoli Crush Saree",
    category: "Sarees",
    price: 899,
    image: "/products/sarees/red-saree.jpeg",
    description: "Traditional red silk saree.",
  },
  {
    name: "Mayuri Salwar Suit Set",
    category: "Kurtis",
    price: 1650,
    image: "/products/kurtis/cotton-kurti1.jpeg",
    description: "Premium cotton kurti.",
  },
  {
    name: "Premium Cotton Kurti Pant with Dupatta Set",
    category: "Kurtis",
    price: 1149,
    image: "/products/kurtis/cotton-kurti2.jpeg",
    description: "Beautiful cotton kurti set.",
  },
  {
    name: "Mal Mal Cotton Printed Kurti Set",
    category: "Kurtis",
    price: 1099,
    image: "/products/kurtis/cotton-kurti3.jpeg",
    description: "Embroidered cotton kurti.",
  },
  {
    name: "Baby Lehanga Gold",
    category: "Kids Wear",
    price: 1349,
    image: "/products/kids/baby-lehanga-gold.jpeg",
    description: "Beautiful baby lehanga.",
  },
  {
    name: "Kids Long Frock with Over Coat",
    category: "Kids Wear",
    price: 1149,
    image: "/products/kids/kids-gown1.jpeg",
    description: "Designer kids gown.",
  },
  {
    name: "Kids Lehenga",
    category: "Kids Wear",
    price: 1399,
    image: "/products/kids/kids-lehenga1.jpeg",
    description: "Festive kids lehenga.",
  },
  {
    name: "Diamond Earrings",
    category: "Jewellery",
    price: 899,
    image: "/products/jewellery/diamond-earrings.jpeg",
    description: "Beautiful diamond earrings.",
  },
  {
    name: "Diamond Necklace",
    category: "Jewellery",
    price: 1999,
    image: "/products/jewellery/diamond-necklace.jpeg",
    description: "Elegant diamond necklace.",
  },
  {
    name: "Gold Long Chain",
    category: "Jewellery",
    price: 1599,
    image: "/products/jewellery/gold-long-chain.jpeg",
    description: "Traditional gold long chain.",
  },
  {
    name: "Gold Necklace",
    category: "Jewellery",
    price: 1899,
    image: "/products/jewellery/gold-necklace.jpeg",
    description: "Beautiful gold necklace.",
  },
  {
    name: "Gold Peacock Earrings",
    category: "Jewellery",
    price: 999,
    image: "/products/jewellery/gold-peacock-earrings.jpeg",
    description: "Peacock design earrings.",
  },
  {
    name: "Hip Belt 1",
    category: "Jewellery",
    price: 1299,
    image: "/products/jewellery/hip-belt1.jpeg",
    description: "Traditional hip belt.",
  },
  {
    name: "Hip Belt 2",
    category: "Jewellery",
    price: 1299,
    image: "/products/jewellery/hip-belt2.jpeg",
    description: "Traditional hip belt.",
  },
  {
    name: "Pearl Earrings 1",
    category: "Jewellery",
    price: 799,
    image: "/products/jewellery/pearl-earrings1.jpeg",
    description: "Elegant pearl earrings.",
  },
  {
    name: "Pearl Earrings 2",
    category: "Jewellery",
    price: 799,
    image: "/products/jewellery/pearl-earrings2.jpeg",
    description: "Elegant pearl earrings.",
  },
  {
    name: "Pink Bangles",
    category: "Jewellery",
    price: 699,
    image: "/products/jewellery/pink-bangles.jpeg",
    description: "Designer pink bangles.",
  },
  {
    name: "Silver Bracelet",
    category: "Jewellery",
    price: 899,
    image: "/products/jewellery/silver-bracelet.jpeg",
    description: "Classic silver bracelet.",
  },
];

async function main() {
  const inserted = [];
  const skipped = [];

  try {
    for (const product of products) {
      const existing = await sql`
        SELECT id
        FROM products
        WHERE name = ${product.name}
          AND category = ${product.category}
          AND price = ${product.price}
      `;

      if (existing.length > 0) {
        skipped.push(product.name);
        continue;
      }

      await sql`
        INSERT INTO products (name, category, price, image, description)
        VALUES (
          ${product.name},
          ${product.category},
          ${product.price},
          ${product.image},
          ${product.description}
        )
      `;
      inserted.push(product.name);
    }

    console.log(`Inserted ${inserted.length} products.`);
    if (skipped.length > 0) {
      console.log(`Skipped ${skipped.length} existing products:`);
      skipped.forEach((name) => console.log(`- ${name}`));
    }
  } catch (error) {
    console.error("Failed to seed products:", error);
    process.exit(1);
  } finally {
    await sql.end({ timeout: 5 });
  }
}

main();
