type EcommerceItem = {
  item_id: string;
  item_name: string;
  price: number;
  quantity: number;
};

type DataLayerWindow = Window & {
  dataLayer?: Array<Record<string, unknown>>;
};

function pushToDataLayer(payload: Record<string, unknown>) {
  if (typeof window === "undefined") return;

  const browserWindow = window as DataLayerWindow;
  browserWindow.dataLayer = browserWindow.dataLayer || [];
  browserWindow.dataLayer.push(payload);
}

export function trackEcommerceEvent(
  eventName: string,
  items: EcommerceItem[],
  value: number,
) {
  pushToDataLayer({ ecommerce: null });
  pushToDataLayer({
    event: eventName,
    ecommerce: {
      currency: "INR",
      value,
      items,
    },
  });
}

export function trackCustomEvent(
  eventName: string,
  parameters: Record<string, string | number | boolean>,
) {
  pushToDataLayer({
    event: eventName,
    ...parameters,
  });
}
