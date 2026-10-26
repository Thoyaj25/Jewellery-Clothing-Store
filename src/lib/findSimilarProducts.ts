import {
  createImageEmbedding,
  cosineSimilarity,
} from "./imageEmbeddings";

export type VisualSearchProduct = {
  id: number;
  name: string;
  image: string;
};

export type VisualSearchMatch = {
  productId: number;
  score: number;
};

type IndexedProduct = {
  id: number;
  embedding: number[];
};

let indexPromise: Promise<IndexedProduct[]> | null = null;

async function loadSearchIndex(): Promise<IndexedProduct[]> {
  if (!indexPromise) {
    indexPromise = fetch("/ai-search/search-index.json")
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Image search index unavailable.");
        }

        const data: unknown = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Invalid image search index.");
        }

        return data.filter(
          (item): item is IndexedProduct =>
            item !== null &&
            typeof item === "object" &&
            typeof item.id === "number" &&
            Array.isArray(item.embedding) &&
            item.embedding.length === 512 &&
            item.embedding.every(
              (value: unknown) =>
                typeof value === "number" &&
                Number.isFinite(value)
            )
        );
      })
      .catch((error) => {
        indexPromise = null;
        throw error;
      });
  }

  return indexPromise;
}

export async function findSimilarProducts(
  selectedImage: string,
  products: VisualSearchProduct[],
  limit = 6
): Promise<VisualSearchMatch[]> {
  const [uploadedEmbedding, index] = await Promise.all([
    createImageEmbedding(selectedImage),
    loadSearchIndex(),
  ]);

  const availableIds = new Set(products.map((product) => product.id));

  const minimumSimilarity = 0.75;

  return index
    .filter((product) => availableIds.has(product.id))
    .map((product) => ({
      productId: product.id,
      score: cosineSimilarity(
        uploadedEmbedding,
        Float32Array.from(product.embedding)
      ),
    }))
    .filter((match) => match.score >= minimumSimilarity)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
