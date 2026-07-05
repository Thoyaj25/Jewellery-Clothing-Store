"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  {
    name: "Products",
    href: "/admin",
    icon: "📦",
    enabled: true,
  },
  {
    name: "Orders",
    href: "",
    icon: "📋",
    enabled: false,
  },
  {
    name: "Analytics",
    href: "",
    icon: "📊",
    enabled: false,
  },
  {
    name: "Customers",
    href: "",
    icon: "👥",
    enabled: false,
  },
  {
    name: "Settings",
    href: "",
    icon: "⚙️",
    enabled: false,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 border-r border-zinc-800 bg-zinc-900 md:flex md:flex-col">
      <div className="border-b border-zinc-800 p-6">
        <h1 className="text-xl font-bold text-amber-400">
          Ultimate Collections
        </h1>

        <p className="mt-1 text-sm text-zinc-400">
          Admin Dashboard
        </p>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const active =
              item.enabled && pathname === item.href;

            const className =
              "flex items-center gap-3 rounded-lg px-4 py-3 transition-colors " +
              (active
                ? "bg-amber-500 text-black font-semibold"
                : item.enabled
                ? "text-zinc-300 hover:bg-zinc-800 hover:text-white"
                : "cursor-not-allowed text-zinc-600");

            if (!item.enabled) {
              return (
                <li key={item.name}>
                  <div className={className}>
                    <span>{item.icon}</span>
                    <span>{item.name}</span>
                    <span className="ml-auto text-xs">
                      Soon
                    </span>
                  </div>
                </li>
              );
            }

            return (
              <li key={item.name}>
                <Link href={item.href} className={className}>
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-zinc-800 p-4 text-sm text-zinc-500">
        Version 1.1
      </div>
    </aside>
  );
}