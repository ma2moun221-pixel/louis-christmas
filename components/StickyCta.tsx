"use client";

import { useEffect, useState } from "react";
import { event } from "@/lib/event";

/** زر حجز ثابت تحت على الموبايل. بيختفي بأول شاشة وبقسم الطاولات وبالآخر */
export default function StickyCta() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hidden = new Set<string>();
    const targets = ["top", "tables", "contact"]
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    const hero = document.querySelector(".hero");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const key = e.target === hero ? "hero" : e.target.id;
          if (e.isIntersecting) hidden.add(key);
          else hidden.delete(key);
        }
        setShow(hidden.size === 0);
      },
      { threshold: 0.05 },
    );
    if (hero) io.observe(hero);
    targets.filter((t) => t.id !== "top").forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  return (
    <div className={`sticky-cta${show ? " show" : ""}`} aria-hidden={!show}>
      <span>
        <b>{event.pricePerGuest} شيكل</b> للشخص · العشاء مشمول
      </span>
      <a className="btn btn-gold" href="#tables" tabIndex={show ? 0 : -1}>
        احجز طاولتك
      </a>
    </div>
  );
}
