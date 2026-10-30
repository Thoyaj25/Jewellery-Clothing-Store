type OrderItemInput = {
  productId: number;
  quantity: number;
};

export type OrderRequest = {
  submissionKey: string;
  customerName: string;
  customerMobile: string;
  customerEmail?: string;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryState: string;
  deliveryPincode: string;
  items: OrderItemInput[];
};

export class OrderValidationError extends Error {}

const clean = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";


export function validateOrderInput(body: OrderRequest) {
    const submissionKey = clean(body.submissionKey);
    const customerName = clean(body.customerName);
    const customerMobile = clean(body.customerMobile);
    const customerEmail = clean(body.customerEmail);
    const deliveryAddress = clean(body.deliveryAddress);
    const deliveryCity = clean(body.deliveryCity);
    const deliveryState = clean(body.deliveryState);
    const deliveryPincode = clean(body.deliveryPincode);

    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(submissionKey)) {
      throw new OrderValidationError("Valid submission key is required.");
    }

    if (
      !customerName ||
      !/^[0-9+()\s-]{10,20}$/.test(customerMobile) ||
      !deliveryAddress ||
      !deliveryCity ||
      !deliveryState ||
      !/^[1-9][0-9]{5}$/.test(deliveryPincode)
    ) {
      throw new OrderValidationError("Please provide valid customer and delivery details.");
    }

    if (customerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
      throw new OrderValidationError("Invalid email address.");
    }

    if (!Array.isArray(body.items) || body.items.length === 0 || body.items.length > 50) {
      throw new OrderValidationError("Order must contain between 1 and 50 items.");
    }

    const quantities = new Map<number, number>();

    for (const item of body.items) {
      if (
        !item ||
        !Number.isSafeInteger(item.productId) ||
        item.productId <= 0 ||
        !Number.isSafeInteger(item.quantity) ||
        item.quantity < 1 ||
        item.quantity > 99
      ) {
        throw new OrderValidationError("Invalid product or quantity.");
      }

      const total = (quantities.get(item.productId) ?? 0) + item.quantity;
      if (total > 99) {
        throw new OrderValidationError("Maximum quantity per product is 99.");
      }

      quantities.set(item.productId, total);
    }


    return { submissionKey, customerName, customerMobile,
      customerEmail, deliveryAddress, deliveryCity,
      deliveryState, deliveryPincode, quantities };
}
