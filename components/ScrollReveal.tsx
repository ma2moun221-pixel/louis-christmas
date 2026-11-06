"use client";

import { useEffect } from "react";

/**
 * أي عنصر عليه data-reveal بيطلع بحركة ناعمة لما يوصله السكرول.
 * data-reveal="up" | "fade" | "zoom" | "side"، و data-delay بالملي ثانية.
 */
export default function ScrollReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }
    els.forEach((el) => {
      const d = el.dataset.delay;
      if (d) el.style.transitionDelay = `${d}ms`;
    });
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}
