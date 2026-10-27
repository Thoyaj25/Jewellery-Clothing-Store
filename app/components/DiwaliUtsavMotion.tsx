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
    element.style.setProperty("--parallax-x", `${(x * -5).toFixed(2)}px`);
    element.style.setProperty("--parallax-y", `${(y * -4).toFixed(2)}px`);
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
    </section>
  );
}
