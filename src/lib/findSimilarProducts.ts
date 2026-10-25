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

export async function findSimilarProducts(
  selectedImage: string,
  products: VisualSearchProduct[],
  limit = 6
): Promise<VisualSearchMatch[]> {
  const uploadedEmbedding = await createImageEmbedding(selectedImage);
  const results: VisualSearchMatch[] = [];

  const batchSize = 3;

  for (let start = 0; start < products.length; start += batchSize) {
    const batch = products.slice(start, start + batchSize);

    const matches = await Promise.all(
      batch.map(async (product) => {
        if (!product.image) return null;

        try {
          const embedding = await createImageEmbedding(product.image);

          return {
            productId: product.id,
            score: cosineSimilarity(uploadedEmbedding, embedding),
          };
        } catch {
          return null;
        }
      })
    );

    for (const match of matches) {
      if (match) results.push(match);
    }
  }

  // Temporary conservative similarity gate.
  // Must be calibrated using real catalogue examples.
  console.info("[CLIP MATCHING]", {
    catalogueProducts: products.length,
    processedImages: results.length,
    scores: results.map((match) => ({
      productId: match.productId,
      similarity: Number(match.score.toFixed(4)),
    })),
  });

  const minimumSimilarity = 0.75;

  return results
    .filter((match) => match.score >= minimumSimilarity)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
