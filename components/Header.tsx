"use client";

import { useEffect, useState } from "react";
import { Icon } from "./Icons";
import { event } from "@/lib/event";

const links = [
  { href: "#about", label: "الحفلة" },
  { href: "#artists", label: "الفنانين" },
  { href: "#experience", label: "البرنامج" },
  { href: "#tables", label: "الطاولات" },
  { href: "#faq", label: "أسئلة" },
  ...(event.hotels.length > 0 ? [{ href: "#stay", label: "الإقامة" }] : []),
  { href: "#contact", label: "تواصل" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="nav">
      <div className="shell nav-inner">
        <a className="brand" href="#top" aria-label="Full Volume Events by Louis">
          <small>FULL</small>
          <b>VOLUME</b>
          <span>EVENTS BY LOUIS</span>
        </a>
        <nav className={`nav-links${open ? " open" : ""}`} id="site-menu" aria-label="القائمة">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
        </nav>
        <a className="btn btn-outline nav-cta" href="#tables">
          احجز طاولتك
        </a>
        <button
          className="menu-btn"
          type="button"
          aria-expanded={open}
          aria-controls="site-menu"
          aria-label={open ? "سكّر القائمة" : "افتح القائمة"}
          onClick={() => setOpen((o) => !o)}
        >
          <Icon name={open ? "close" : "menu"} size={24} />
        </button>
      </div>
    </header>
  );
}
