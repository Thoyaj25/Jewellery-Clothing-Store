import fs from "node:fs";
import path from "node:path";
import { Client } from "pg";

const envPaths = [
  path.resolve(process.cwd(), ".env.local"),
  path.resolve(process.cwd(), ".env.production.local"),
];

for (const envPath of envPaths) {
  if (process.env.DATABASE_URL || !fs.existsSync(envPath)) {
    continue;
  }

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

const url = new URL(connectionString);
const endpoint = url.hostname.split(".")[0].replace(/-pooler$/, "");

const sql = new Client({
  host: "3.220.135.142",
  port: Number(url.port || 5432),
  database: url.pathname.replace(/^\//, ""),
  user: decodeURIComponent(url.username),
  password: decodeURIComponent(url.password),
  ssl: { rejectUnauthorized: false },
  options: `endpoint=${endpoint}`,
});

await sql.connect();

await sql.query(`
  CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
    image TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );
`);

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
      const existing = await sql.query(
        `SELECT id
         FROM products
         WHERE name = $1
           AND category = $2
           AND price = $3`,
        [product.name, product.category, product.price]
      );

      if (existing.rows.length > 0) {
        skipped.push(product.name);
        continue;
      }

      await sql.query(
        `INSERT INTO products (name, category, price, image, description)
         VALUES ($1, $2, $3, $4, $5)`,
        [product.name, product.category, product.price, product.image, product.description]
      );
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
    await sql.end();
  }
}

main();
