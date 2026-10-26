export function loadImageForSearch(
  url: string,
  timeoutMs = 10000
): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    let settled = false;

    const timeout = window.setTimeout(() => {
      if (settled) return;
      settled = true;
      image.onload = null;
      image.onerror = null;
      image.src = "";
      reject(new Error("Image loading timed out."));
    }, timeoutMs);

    function finish(error?: Error) {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeout);
      image.onload = null;
      image.onerror = null;

      if (error) {
        reject(error);
      } else {
        resolve(image);
      }
    }

    image.crossOrigin = "anonymous";

    image.onload = () => finish();

    image.onerror = () =>
      finish(new Error("Product image could not be loaded."));

    image.src = url;
  });
}
