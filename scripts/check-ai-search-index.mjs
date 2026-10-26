import fs from "node:fs/promises";

const INDEX_PATH = "public/ai-search/search-index.json";
const CATALOGUE_URL =
  "https://ultimate-collections-store.vercel.app/api/products";
const ORIGIN = "https://ultimate-collections-store.vercel.app";

const index = JSON.parse(await fs.readFile(INDEX_PATH, "utf8"));

const response = await fetch(CATALOGUE_URL, {
  signal: AbortSignal.timeout(15000),
  cache: "no-store",
});

if (!response.ok) {
  throw new Error(`Catalogue request failed: HTTP ${response.status}`);
}

const data = await response.json();
const products = Array.isArray(data) ? data : data.products;

if (!Array.isArray(products)) {
  throw new Error("Invalid catalogue response.");
}

const current = new Map(
  products
    .filter(
      (p) =>
        Number.isInteger(p.id) &&
        typeof p.image === "string" &&
        p.image.length > 0 &&
        p.isVisible !== false
    )
    .map((p) => [p.id, new URL(p.image, ORIGIN).href])
);

const indexed = new Map(index.map((p) => [p.id, p.image]));

const added = [...current.keys()].filter((id) => !indexed.has(id));
const removed = [...indexed.keys()].filter((id) => !current.has(id));
const changed = [...current.keys()].filter(
  (id) => indexed.has(id) && indexed.get(id) !== current.get(id)
);

console.log("CURRENT_PRODUCTS:", current.size);
console.log("INDEXED_PRODUCTS:", indexed.size);
console.log("NEW_PRODUCTS:", added);
console.log("REMOVED_OR_HIDDEN_PRODUCTS:", removed);
console.log("CHANGED_IMAGE_URLS:", changed);
console.log("INDEX_MODIFIED: false");
