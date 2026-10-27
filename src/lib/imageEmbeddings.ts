// Load the AI runtime only when image search is requested.
async function loadExtractor() {
  const { pipeline } = await import("@huggingface/transformers");
  return pipeline(
    "image-feature-extraction",
    MODEL_ID,
    { dtype: "int8" }
  );
}

const MODEL_ID = "Xenova/clip-vit-base-patch32";

let extractorPromise: ReturnType<typeof loadExtractor> | null = null;

async function getExtractor() {
  if (!extractorPromise) {
    extractorPromise = loadExtractor();
  }

  try {
    return await extractorPromise;
  } catch (error) {
    extractorPromise = null;
    throw error;
  }
}

export async function createImageEmbedding(
  imageUrl: string
): Promise<Float32Array> {
  const extractor = await getExtractor();
  const response = await fetch(imageUrl);

  if (!response.ok) {
    throw new Error("Unable to load image for visual search.");
  }

  const buffer = await response.arrayBuffer();
  const { RawImage } = await import("@huggingface/transformers");
  const image = await RawImage.fromBlob(
    new Blob([buffer], {
      type: response.headers.get("content-type") || "image/jpeg",
    })
  );

  const output = await extractor(image);

  const values = Float32Array.from(output.data);

  let magnitude = 0;

  for (const value of values) {
    magnitude += value * value;
  }

  magnitude = Math.sqrt(magnitude);

  if (!Number.isFinite(magnitude) || magnitude === 0) {
    throw new Error("Invalid image embedding.");
  }

  for (let i = 0; i < values.length; i++) {
    values[i] /= magnitude;
  }

  return values;
}

export function cosineSimilarity(
  first: Float32Array,
  second: Float32Array
): number {
  if (first.length !== second.length || first.length === 0) {
    throw new Error("Incompatible image embeddings.");
  }

  let similarity = 0;

  for (let i = 0; i < first.length; i++) {
    similarity += first[i] * second[i];
  }

  return Math.max(-1, Math.min(1, similarity));
}
