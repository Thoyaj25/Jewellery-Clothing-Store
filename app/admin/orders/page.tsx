import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/src/lib/auth";
import { query } from "@/src/lib/db";
import OrderActions from "./OrderActions";
import PaymentActions from "./PaymentActions";
import ShipmentActions from "./ShipmentActions";
import NotificationActions from "./NotificationActions";

export const dynamic = "force-dynamic";

type OrderRow = {
  id: string;
  order_reference: string;
  customer_name: string;
  customer_mobile: string;
  status: string;
  total_amount: string;
  payment_status: string;
  courier_name: string | null;
  tracking_number: string | null;
  notification_count: number;
  created_at: Date;
};

export default async function AdminOrdersPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.isAdmin) {
    redirect("/api/auth/signin?callbackUrl=/admin/orders");
  }

  const { rows: orders } = await query<OrderRow>(`
    SELECT
      o.id,
      o.order_reference,
      o.customer_name,
      o.customer_mobile,
      o.status,
      o.total_amount,
      o.created_at,
      COALESCE(p.status, 'Pending') AS payment_status,
      s.courier_name,
      s.tracking_number,
      (
        SELECT COUNT(*)::int
        FROM public.order_notifications n
        WHERE n.order_id = o.id
      ) AS notification_count
    FROM public.orders o
    LEFT JOIN public.order_payments p ON p.order_id = o.id
    LEFT JOIN public.order_shipments s ON s.order_id = o.id
    ORDER BY created_at DESC, id DESC
    LIMIT 100
  `);

  return (
    <main className="min-h-screen bg-black px-4 py-10 text-white sm:px-6">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/admin"
          className="text-sm text-green-400 hover:text-green-300"
        >
          ← Back to Admin Dashboard
        </Link>

        <h1 className="mt-6 text-3xl font-bold">
          Order Management
        </h1>

        <p className="mt-3 text-zinc-400">
          Review customer orders and manage order requests.
        </p>

        <section className="mt-8 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
          <div className="border-b border-zinc-800 p-6">
            <h2 className="text-xl font-semibold">
              Customer Orders ({orders.length})
            </h2>
          </div>

          {orders.length === 0 ? (
            <p className="p-6 text-zinc-400">
              No customer orders found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-800 text-zinc-300">
                  <tr>
                    <th className="p-4">Order Reference</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Mobile</th>
                    <th className="p-4">Total</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Payment</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Actions</th>
                    <th className="p-4">Payment Actions</th>
                    <th className="p-4">Courier Tracking</th>
                    <th className="p-4">WhatsApp Notifications</th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-t border-zinc-800"
                    >
                      <td className="p-4 font-semibold text-green-400">
                        {order.order_reference}
                      </td>
                      <td className="p-4">{order.customer_name}</td>
                      <td className="p-4">{order.customer_mobile}</td>
                      <td className="p-4">
                        ₹{Number(order.total_amount).toLocaleString("en-IN")}
                      </td>
                      <td className="p-4">
                        <span className="rounded-full border border-amber-600/50 px-3 py-1 text-amber-400">
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="rounded-full border border-zinc-600 px-3 py-1 text-zinc-300">
                          {order.payment_status}
                        </span>
                      </td>
                      <td className="p-4 text-zinc-400">
                        {new Date(order.created_at).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          timeZone: "Asia/Kolkata",
                        })}
                      </td>
                      <td className="p-4">
                        <OrderActions
                          orderId={order.id}
                          status={order.status}
                        />
                      </td>
                      <td className="p-4">
                        <PaymentActions
                          orderId={order.id}
                          orderStatus={order.status}
                          paymentStatus={order.payment_status}
                        />
                      </td>
                      <td className="p-4">
                        <ShipmentActions
                          orderId={order.id}
                          orderStatus={order.status}
                          courierName={order.courier_name}
                          trackingNumber={order.tracking_number}
                        />
                      </td>
                      <td className="p-4">
                        <NotificationActions
                          orderId={order.id}
                          notificationCount={order.notification_count}
                          orderStatus={order.status}
                          paymentStatus={order.payment_status}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
