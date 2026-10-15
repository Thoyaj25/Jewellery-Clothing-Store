import Link from "next/link";

export default function Header() {
  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 bg-zinc-950 px-4 py-5 sm:px-6">
      <div>
        <h2 className="text-2xl font-semibold text-white">
          Dashboard
        </h2>

        <p className="mt-1 text-sm text-zinc-400">
          Welcome to the Ultimate Collections admin panel
        </p>
      </div>

      <div className="text-right">
        <p className="text-sm text-zinc-400">
          {today}
        </p>

        <div className="mt-2 inline-flex items-center rounded-full bg-emerald-600/20 px-3 py-1 text-sm font-medium text-emerald-400">
          ● System Online
        </div>
      </div>
      <nav
        aria-label="Mobile admin navigation"
        className="flex w-full gap-3 border-t border-zinc-800 pt-4 md:hidden"
      >
        <Link
          href="/admin"
          className="rounded-lg border border-amber-600/40 px-4 py-2 text-sm text-amber-400"
        >
          Products
        </Link>
        <Link
          href="/admin/orders"
          className="rounded-lg border border-amber-600/40 px-4 py-2 text-sm text-amber-400"
        >
          Orders
        </Link>
      </nav>
    </header>
  );
}
