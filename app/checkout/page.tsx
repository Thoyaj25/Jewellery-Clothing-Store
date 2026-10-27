"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useCart } from "../context/CartProvider";
import { getDiwaliDiscount } from "@/src/lib/diwaliOffer";

const FREE_SHIPPING_THRESHOLD = 2000;
const SHIPPING_COST = 100;

export default function CheckoutPage() {
  const { items, totalPrice, mounted } = useCart();

  const [customerName, setCustomerName] = useState("");
  const [mobile, setMobile] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [postalOffices, setPostalOffices] = useState<string[]>([]);
  const [postalMessage, setPostalMessage] = useState("");
  const [postalLoading, setPostalLoading] = useState(false);

  useEffect(() => {
    if (!/^[1-9][0-9]{5}$/.test(pincode)) {
      setPostalOffices([]);
      setPostalMessage("");
      setPostalLoading(false);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setPostalLoading(true);
      setPostalMessage("");
      setPostalOffices([]);

      try {
        const response = await fetch(
          `https://api.postalpincode.in/pincode/${pincode}`,
          { signal: controller.signal }
        );
        if (!response.ok) throw new Error("Lookup unavailable");

        const records = await response.json();
        const offices = records?.[0]?.PostOffice;

        if (!Array.isArray(offices) || offices.length === 0) {
          setPostalMessage("No postal locations found. Please verify your PIN code.");
          return;
        }

        setPostalOffices(
          [...new Set(offices.map((office: { Name: string }) => office.Name))]
        );
        setCity(offices[0].District || "");
        setState(offices[0].State || "");
      } catch (error) {
        if (controller.signal.aborted) return;
        setPostalMessage(
          "Postal lookup is temporarily unavailable. Please enter your city and state manually."
        );
      } finally {
        if (!controller.signal.aborted) setPostalLoading(false);
      }
    }, 500);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [pincode]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [whatsappRetryUrl, setWhatsappRetryUrl] = useState<string | null>(null);
  const [confirmedOrderReference, setConfirmedOrderReference] = useState<string | null>(null);
  const submissionKeyRef = useRef<string | null>(null);
  const submissionFingerprintRef = useRef<string | null>(null);

  if (!mounted) {
    return (
      <div className="min-h-[70vh] bg-black px-4 py-12 text-white">
        <div className="mx-auto max-w-6xl">
          <p className="text-zinc-400">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] bg-black px-4 py-12 text-white">
        <div className="mx-auto flex max-w-2xl flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 text-6xl">🛒</div>

          <h1 className="mb-3 text-3xl font-bold">
            Your cart is empty
          </h1>

          <p className="mb-8 text-zinc-400">
            Add some products before proceeding to checkout.
          </p>

          <Link
            href="/products"
            className="rounded-lg bg-green-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-green-700"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const shippingCost =
    totalPrice >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const diwaliDiscount = getDiwaliDiscount(totalPrice);
  const total = totalPrice + shippingCost - diwaliDiscount;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) return;

    const whatsappNumber = process.env.NEXT_PUBLIC_CONTACT_WHATSAPP;

    if (!whatsappNumber) {
      window.alert("WhatsApp ordering is currently unavailable.");
      return;
    }

    const orderItems = items.map((item) => ({
      productId: Number(item.id),
      quantity: item.quantity,
    }));

    if (orderItems.some((item) => !Number.isSafeInteger(item.productId) || item.productId <= 0)) {
      window.alert("Your cart contains an invalid product. Please review your cart.");
      return;
    }

    const submissionFingerprint = JSON.stringify({
      customerName: customerName.trim(),
      mobile: mobile.trim(),
      customerEmail: customerEmail.trim(),
      address: address.trim(),
      city: city.trim(),
      state: state.trim(),
      pincode: pincode.trim(),
      items: [...orderItems].sort((a, b) => a.productId - b.productId),
    });

    if (
      !submissionKeyRef.current ||
      submissionFingerprintRef.current !== submissionFingerprint
    ) {
      submissionKeyRef.current = crypto.randomUUID();
      submissionFingerprintRef.current = submissionFingerprint;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionKey: submissionKeyRef.current,
          customerName,
          customerMobile: mobile,
          customerEmail,
          deliveryAddress: address,
          deliveryCity: city,
          deliveryState: state,
          deliveryPincode: pincode,
          items: orderItems,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Unable to save your order.");
      }

      const { orderReference, totalAmount } = result.order;

      const lines = [
        "Hello Ultimate Collections! I have submitted an order request through your website.",
        "",
        `Order Reference: ${orderReference}`,
        `Customer Name: ${customerName}`,
        `Mobile: ${mobile}`,
        ...(customerEmail ? [`Email: ${customerEmail}`] : []),
        `Delivery Address: ${address}`,
        `City: ${city}`,
        `State: ${state}`,
        `PIN Code: ${pincode}`,
        "",
        "Order Items:",
      ];

      items.forEach((item) => {
        lines.push(`- ${item.name} (ID: ${item.id}) x ${item.quantity}`);
      });

      lines.push(
        "",
        `Order Total: ₹${Number(totalAmount).toLocaleString("en-IN")}`,
        "",
        "Please confirm product availability, payment options and delivery details. I understand my order is awaiting confirmation and I should not make payment until Ultimate Collections provides instructions."
      );

      const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(lines.join("\n"))}`;

      setWhatsappRetryUrl(url);
      setConfirmedOrderReference(orderReference);
    } catch (error) {
      window.alert(
        error instanceof Error ? error.message : "Unable to submit your order."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {confirmedOrderReference && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="order-success-heading"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
        >
          <div className="w-full max-w-md rounded-2xl border border-amber-600/30 bg-zinc-900 p-6 text-center shadow-2xl sm:p-8">
            <div className="mb-4 text-5xl text-green-400" aria-hidden="true">✓</div>
            <h2 id="order-success-heading" className="text-2xl font-bold text-white">
              Order Request Submitted!
            </h2>
            <p className="mt-3 text-sm text-zinc-300">
              Thank you for shopping with Ultimate Collections.
            </p>
            <div className="my-5 rounded-xl bg-zinc-800 p-4">
              <p className="text-xs text-zinc-400">YOUR ORDER REFERENCE</p>
              <p className="mt-1 text-xl font-semibold text-amber-400">
                {confirmedOrderReference}
              </p>
            </div>
            <h3 className="mb-2 text-sm font-semibold text-amber-400">
              What's Next?
            </h3>
            <p className="mb-5 text-sm leading-relaxed text-zinc-300">
              Your order request has been saved successfully. Our team will
              confirm product availability, payment options and delivery
              details. Please do not make any payment until we confirm.
            </p>
            {whatsappRetryUrl && (
              <a
                href={whatsappRetryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full rounded-lg bg-green-600 px-4 py-3 font-semibold text-white hover:bg-green-500"
              >
                Send Order Details via WhatsApp
              </a>
            )}
            <Link
              href="/products"
              className="mt-4 block text-sm text-amber-400 hover:text-amber-300"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      )}
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black px-4 py-10 text-white sm:px-6 lg:py-14">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <h1 className="text-3xl font-bold sm:text-4xl">
            Checkout
          </h1>
          <p className="mt-2 text-zinc-400">
            Enter your delivery details and review your order.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-8 lg:grid-cols-3"
        >
          <div className="space-y-6 lg:col-span-2">
            <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
              <h2 className="mb-6 text-xl font-semibold">
                Customer Information
              </h2>

              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="customerName"
                    className="mb-2 block text-sm font-medium text-zinc-300"
                  >
                    Full Name
                  </label>

                  <input
                    id="customerName"
                    type="text"
                    value={customerName}
                    onChange={(event) => setCustomerName(event.target.value.slice(0, 40))}
                    maxLength={40}
                    required
                    autoComplete="name"
                    className="w-full rounded-lg border border-zinc-700 bg-black px-4 py-3 text-white outline-none transition-colors placeholder:text-zinc-600 focus:border-green-500"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="mobile"
                    className="mb-2 block text-sm font-medium text-zinc-300"
                  >
                    Mobile Number
                  </label>

                  <input
                    id="mobile"
                    type="tel"
                    value={mobile}
                    onChange={(event) =>
                      setMobile(event.target.value.replace(/\D/g, "").slice(0, 10))
                    }
                    required
                    autoComplete="tel-national"
                    inputMode="numeric"
                    pattern="[6-9][0-9]{9}"
                    title="Enter a valid 10-digit Indian mobile number starting with 6, 7, 8 or 9"
                    maxLength={10}
                    className="w-full rounded-lg border border-zinc-700 bg-black px-4 py-3 text-white outline-none transition-colors placeholder:text-zinc-600 focus:border-green-500"
                    placeholder="10-digit mobile number"
                  />
                </div>

                <div>
                  <label
                    htmlFor="customerEmail"
                    className="mb-2 block text-sm font-medium text-zinc-300"
                  >
                    Email Address (Optional)
                  </label>
                  <input
                    id="customerEmail"
                    type="email"
                    value={customerEmail}
                    onChange={(event) =>
                      setCustomerEmail(event.target.value.slice(0, 254))
                    }
                    maxLength={254}
                    autoComplete="email"
                    placeholder="Enter your email address"
                    className="w-full rounded-lg border border-zinc-700 bg-black px-4 py-3 text-white outline-none transition-colors placeholder:text-zinc-600 focus:border-green-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="address"
                    className="mb-2 block text-sm font-medium text-zinc-300"
                  >
                    Delivery Address
                  </label>

                  <textarea
                    id="address"
                    value={address}
                    onChange={(event) =>
                      setAddress(event.target.value.slice(0, 200))
                    }
                    maxLength={200}
                    required
                    rows={5}
                    autoComplete="street-address"
                    className="w-full resize-y rounded-lg border border-zinc-700 bg-black px-4 py-3 text-white outline-none transition-colors placeholder:text-zinc-600 focus:border-green-500"
                    placeholder="Enter your complete delivery address"
                  />
                  <p className="mt-2 text-right text-xs text-zinc-400">
                    {address.length}/200 characters
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="city" className="mb-2 block text-sm font-medium text-zinc-300">
                      City
                    </label>
                    <input
                      id="city"
                      value={city}
                      onChange={(event) => setCity(event.target.value.slice(0, 100))}
                      required
                      maxLength={100}
                      autoComplete="address-level2"
                      placeholder="Enter city"
                      className="w-full rounded-lg border border-zinc-700 bg-black px-4 py-3 text-white outline-none focus:border-green-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="state" className="mb-2 block text-sm font-medium text-zinc-300">
                      State
                    </label>
                    <input
                      id="state"
                      value={state}
                      onChange={(event) => setState(event.target.value.slice(0, 100))}
                      required
                      maxLength={100}
                      autoComplete="address-level1"
                      placeholder="Enter state"
                      className="w-full rounded-lg border border-zinc-700 bg-black px-4 py-3 text-white outline-none focus:border-green-500"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="pincode" className="mb-2 block text-sm font-medium text-zinc-300">
                    PIN Code
                  </label>
                  <input
                    id="pincode"
                    type="text"
                    inputMode="numeric"
                    value={pincode}
                    onChange={(event) =>
                      setPincode(event.target.value.replace(/\\D/g, "").slice(0, 6))
                    }
                    required
                    maxLength={6}
                    pattern="[1-9][0-9]{5}"
                    title="Enter a valid 6-digit Indian PIN code"
                    autoComplete="postal-code"
                    placeholder="6-digit PIN code"
                    className="w-full rounded-lg border border-zinc-700 bg-black px-4 py-3 text-white outline-none focus:border-green-500"
                  />
                  {postalLoading && (
                    <p className="mt-2 text-xs text-zinc-400" role="status">
                      Finding postal locations...
                    </p>
                  )}
                  {postalOffices.length > 0 && (
                    <div className="mt-3 rounded-lg border border-amber-700/30 bg-zinc-950 px-4 py-3">
                      <p className="text-sm font-medium text-amber-400">
                        Postal locations found
                      </p>
                      <p className="mt-1 text-xs text-zinc-300">
                        {postalOffices.join(", ")}
                      </p>
                      <p className="mt-2 text-xs text-zinc-400">
                        City/district and state filled automatically. Please verify your address.
                      </p>
                    </div>
                  )}
                  {postalMessage && (
                    <p role="status" className="mt-2 text-xs text-amber-300">
                      {postalMessage}
                    </p>
                  )}
                  {pincode.length === 6 && /^[1-9][0-9]{5}$/.test(pincode) && (
                    <div role="status" className="mt-3 rounded-lg border border-amber-700/30 bg-amber-950/20 px-4 py-3">
                      <p className="text-sm font-medium text-amber-400">
                        Delivery confirmation required
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-zinc-300">
                        Your PIN code format is valid. Delivery availability and
                        estimated arrival will be confirmed through WhatsApp
                        after your order request.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-amber-700/30 bg-amber-950/20 p-6">
              <h2 className="mb-2 text-lg font-semibold text-amber-400">
                Payment Information
              </h2>

              <p className="text-sm leading-relaxed text-zinc-300">
                Online payment is not enabled yet. After you place the order
                through WhatsApp, payment and delivery details will be
                confirmed separately.
              </p>
            </section>
          </div>

          <aside className="h-fit rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 lg:sticky lg:top-6">
            <h2 className="mb-6 text-xl font-bold">
              Order Summary
            </h2>

            <div className="space-y-4 border-b border-zinc-700 pb-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between gap-4 text-sm"
                >
                  <div>
                    <p className="font-medium text-white">
                      {item.name}
                    </p>
                    <p className="mt-1 text-zinc-500">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  <span className="whitespace-nowrap text-zinc-300">
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-3 border-b border-zinc-700 py-6 text-sm">
              <div className="flex justify-between text-zinc-300">
                <span>Subtotal</span>
                <span>₹{totalPrice.toLocaleString("en-IN")}</span>
              </div>

              {diwaliDiscount > 0 && (
                <div className="flex justify-between text-amber-300">
                  <span>Diwali Utsav (5% OFF, max ₹30)</span>
                  <span>-₹{diwaliDiscount.toLocaleString("en-IN")}</span>
                </div>
              )}

              <div className="flex justify-between text-zinc-300">
                <span>Shipping</span>
                <span className={shippingCost === 0 ? "text-green-400" : ""}>
                  {shippingCost === 0
                    ? "FREE"
                    : `₹${shippingCost.toLocaleString("en-IN")}`}
                </span>
              </div>
            </div>

            <div className="flex justify-between py-6">
              <span className="text-lg font-semibold">
                Total
              </span>

              <span className="text-2xl font-bold text-green-400">
                ₹{total.toLocaleString("en-IN")}
              </span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-green-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Saving your order..." : "Place Order via WhatsApp"}
            </button>

            {whatsappRetryUrl && (
              <a
                href={whatsappRetryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 block rounded-lg border border-green-500 px-4 py-3 text-center font-semibold text-green-400 hover:bg-green-950"
              >
                Continue to WhatsApp
              </a>
            )}

            <p className="mt-4 text-center text-xs leading-relaxed text-zinc-500">
              Thank you for choosing Ultimate Collections! Your order
              request will be reviewed by our team. We will confirm product
              availability, payment options and delivery details through
              WhatsApp. Please wait for confirmation before making payment.
            </p>

            <Link
              href="/cart"
              className="mt-4 block text-center text-sm text-zinc-400 transition-colors hover:text-white"
            >
              ← Back to Cart
            </Link>
          </aside>
        </form>
      </div>
    </div>
    </>
  );
}
