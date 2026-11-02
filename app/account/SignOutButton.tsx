"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => void signOut({ callbackUrl: "/" })}
      className="rounded-lg border border-amber-600/50 px-5 py-3 text-sm text-amber-300 hover:bg-amber-900/20"
    >
      Sign Out
    </button>
  );
}
