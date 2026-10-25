export type ImageFingerprint = number[];

const IMAGE_SIZE = 16;

export function createImageFingerprint(
  image: CanvasImageSource
): ImageFingerprint {
  const canvas = document.createElement("canvas");
  canvas.width = IMAGE_SIZE;
  canvas.height = IMAGE_SIZE;

  const context = canvas.getContext("2d", {
    willReadFrequently: true,
  });

  if (!context) {
    throw new Error("Canvas processing is unavailable.");
  }

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, IMAGE_SIZE, IMAGE_SIZE);
  context.drawImage(image, 0, 0, IMAGE_SIZE, IMAGE_SIZE);

  const { data } = context.getImageData(
    0,
    0,
    IMAGE_SIZE,
    IMAGE_SIZE
  );

  const fingerprint: number[] = [];

  for (let i = 0; i < data.length; i += 4) {
    const gray =
      0.299 * data[i] +
      0.587 * data[i + 1] +
      0.114 * data[i + 2];

    fingerprint.push(gray / 255);
  }

  return fingerprint;
}

export function compareImageFingerprints(
  first: ImageFingerprint,
  second: ImageFingerprint
): number {
  if (first.length !== second.length || first.length === 0) {
    throw new Error("Incompatible image fingerprints.");
  }

  let distance = 0;

  for (let i = 0; i < first.length; i++) {
    distance += Math.abs(first[i] - second[i]);
  }

  return Math.max(0, Math.min(1, 1 - distance / first.length));
}
