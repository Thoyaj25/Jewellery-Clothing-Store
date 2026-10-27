"use client";

import Image from "next/image";
import { useRef } from "react";
import styles from "./DiwaliUtsavMotion.module.css";

const sparks = [
  [8, 22, 0.2, 4.1], [15, 58, 1.4, 5.2], [25, 16, 2.2, 4.9],
  [34, 72, 0.6, 5.8], [46, 21, 3.3, 4.4], [53, 61, 1.2, 5.1],
  [63, 13, 2.8, 5.5], [72, 42, 0.8, 4.7], [83, 22, 2.1, 6.1],
  [91, 64, 3.6, 4.5], [58, 84, 2.7, 5.3], [18, 83, 1.9, 5.9],
] as const;

export default function DiwaliUtsavMotion() {
  const ref = useRef<HTMLElement>(null);

  function handlePointerMove(event: React.PointerEvent<HTMLElement>) {
    if (event.pointerType === "touch") return;
    const element = ref.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    element.style.setProperty("--parallax-x", `${(x * -14).toFixed(2)}px`);
    element.style.setProperty("--parallax-y", `${(y * -10).toFixed(2)}px`);
  }

  function resetParallax() {
    ref.current?.style.setProperty("--parallax-x", "0px");
    ref.current?.style.setProperty("--parallax-y", "0px");
  }

  return (
    <section
      ref={ref}
      aria-label="Ultimate Collections Diwali Utsav 2026 promotion"
      className={styles.section}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetParallax}
    >
      <div className={styles.banner}>
        <div className={styles.picture}>
          <Image
            src="/images/promotions/diwali-utsav-final-2026.png"
            alt="Ultimate Collections Diwali Utsav: festive jewellery, clothing, handbags and 5 percent off, maximum 30 rupees"
            width={1983}
            height={793}
            sizes="(max-width: 768px) 100vw, 1280px"
            className={styles.image}
            priority={false}
          />
        </div>
        <a
          href="/products"
          className={styles.shopOverlay}
          aria-label="Shop Diwali Utsav collections"
        />
        <div className={styles.ambient} aria-hidden="true" />
        <div className={styles.lampGlowLeft} aria-hidden="true" />
        <div className={styles.lampGlowRight} aria-hidden="true" />
        {/* Independent moving diya illustrations — not part of the photograph */}
        <div className={styles.floatingDiyas} aria-hidden="true">
          {[0, 1].map((index) => (
            <div
              key={index}
              className={`${styles.floatingDiya} ${
                index === 0 ? styles.diyaLeft : styles.diyaRight
              }`}
            >
              <svg
                viewBox="0 0 100 110"
                width="100%"
                height="100%"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <ellipse cx="50" cy="98" rx="34" ry="5"
                  fill="#FFA82A" opacity=".25" />
                <path
                  d="M50 8 C65 30 60 42 50 49 C39 42 35 29 50 8Z"
                  fill="#FFD772"
                  className={styles.diyaFlame}
                />
                <path
                  d="M50 25 C56 36 54 42 50 46 C45 42 44 35 50 25Z"
                  fill="#FFF8CD"
                />
                <path
                  d="M11 65 Q50 100 89 65 Q81 93 50 96 Q19 93 11 65Z"
                  fill="#B96D22"
                  stroke="#F8D080"
                  strokeWidth="3"
                />
                <path
                  d="M11 65 Q50 83 89 65"
                  stroke="#FFD78B"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
                <path
                  d="M29 82 Q50 93 71 82"
                  stroke="#FFDF8F"
                  strokeWidth="2"
                  opacity=".7"
                />
              </svg>
            </div>
          ))}
        </div>
        <div className={styles.sparkles} aria-hidden="true">
          {sparks.map(([x, y, delay, duration], index) => (
            <span
              key={index}
              className={styles.spark}
              style={{
                left: `${x}%`,
                top: `${y}%`,
                animationDelay: `-${delay}s`,
                animationDuration: `${duration}s`,
              }}
            />
          ))}
        </div>
      </div>
      <a
        href="/products"
        className={styles.mobileShopButton}
      >
        Shop Festive Collections
        <span aria-hidden="true"> →</span>
      </a>
    </section>
  );
}
