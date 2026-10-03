"use client";

import { QRCodeSVG } from "qrcode.react";

const STORE_URL = "https://ultimate-collections-store.vercel.app";

export default function WebsiteQRCode() {
  return (
    <section className="border-t border-amber-600/20 pt-12 md:pt-20 mt-12 md:mt-20">
      <div className="mx-auto max-w-md text-center">
        <h2 className="text-2xl sm:text-3xl font-light text-white mb-3">
          Scan to Visit Ultimate Collections
        </h2>

        <p className="text-gray-400 text-sm sm:text-base mb-6">
          Scan the QR code with your phone to visit our store.
        </p>

        <div className="inline-flex rounded-2xl bg-white p-4 shadow-lg">
          <QRCodeSVG
            value={STORE_URL}
            size={220}
            level="H"
            includeMargin
          />
        </div>
      </div>
    </section>
  );
}
