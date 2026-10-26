import fs from "node:fs/promises";
import { pipeline } from "@huggingface/transformers";

const ORIGIN = "https://ultimate-collections-store.vercel.app";
const INDEX_PATH = "public/ai-search/search-index.json";
const OUTPUT_PATH = "/tmp/ultimate-collections-image-search/refreshed-index.json";

const response = await fetch(`${ORIGIN}/api/products`, {
  signal: AbortSignal.timeout(15000),
  cache: "no-store",
});

if (!response.ok) {
  throw new Error(`Catalogue HTTP ${response.status}`);
}

const data = await response.json();
const products = Array.isArray(data) ? data : data.products;

if (!Array.isArray(products) || products.length === 0) {
  throw new Error("Invalid or empty catalogue. Aborting.");
}

const catalogue = products
  .filter(
    p =>
      Number.isInteger(p.id) &&
      typeof p.image === "string" &&
      p.image.length > 0 &&
      p.isVisible !== false
  )
  .map(p => ({
    id: p.id,
    image: new URL(p.image, ORIGIN).href,
  }));

if (catalogue.length === 0) {
  throw new Error("No eligible products. Aborting.");
}

if (new Set(catalogue.map(p => p.id)).size !== catalogue.length) {
  throw new Error("Duplicate product IDs detected. Refresh aborted.");
}

const existing = JSON.parse(await fs.readFile(INDEX_PATH, "utf8"));
const previous = new Map(existing.map(p => [p.id, p]));

const currentIds = new Set(catalogue.map(p => p.id));
const removedIds = [...previous.keys()].filter(
  id => !currentIds.has(id)
);

if (
  removedIds.length > 0 &&
  process.env.ALLOW_AI_INDEX_REMOVALS !== "true"
) {
  throw new Error(
    `Refresh would remove ${removedIds.length} indexed products. ` +
    `Review product visibility and deletion first. ` +
    `Set ALLOW_AI_INDEX_REMOVALS=true only after verification.`
  );
}

let extractor;
let generated = 0;
let reused = 0;
const updated = [];

for (const product of catalogue) {
  const cached = previous.get(product.id);

  if (
    cached?.image === product.image &&
    Array.isArray(cached.embedding) &&
    cached.embedding.length === 512 &&
    cached.embedding.every(Number.isFinite)
  ) {
    updated.push(cached);
    reused++;
    continue;
  }

  extractor ??= await pipeline(
    "image-feature-extraction",
    "Xenova/clip-vit-base-patch32"
  );

  const output = await extractor(product.image);
  const values = Array.from(output.data);
  const magnitude = Math.hypot(...values);

  if (
    values.length !== 512 ||
    !values.every(Number.isFinite) ||
    !Number.isFinite(magnitude) ||
    magnitude === 0
  ) {
    throw new Error(`Invalid embedding for product ${product.id}`);
  }

  updated.push({
    id: product.id,
    image: product.image,
    embedding: values.map(value => value / magnitude),
  });

  generated++;
}

if (
  updated.length !== catalogue.length ||
  new Set(updated.map(p => p.id)).size !== catalogue.length ||
  updated.some(p =>
    !Array.isArray(p.embedding) ||
    p.embedding.length !== 512 ||
    !p.embedding.every(Number.isFinite)
  )
) {
  throw new Error("Incomplete or invalid AI index. Refresh aborted.");
}

await fs.mkdir("/tmp/ultimate-collections-image-search", {
  recursive: true,
});

await fs.writeFile(OUTPUT_PATH, JSON.stringify(updated));

console.log("REFRESH_PREVIEW_SUCCESS: true");
console.log("CURRENT_PRODUCTS:", catalogue.length);
console.log("REUSED_EMBEDDINGS:", reused);
console.log("GENERATED_EMBEDDINGS:", generated);
console.log("REMOVED_FROM_INDEX:", existing.length - reused - generated);
console.log("PREVIEW_FILE:", OUTPUT_PATH);
console.log("PRODUCTION_INDEX_MODIFIED: false");
