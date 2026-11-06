"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Icon } from "./Icons";
import { event, tablePrice, whatsappLink, type HallTable } from "@/lib/event";
import { track } from "@/lib/track";

const booked = new Set(event.bookedTables);
const maxSeats = Math.max(...event.tables.map((t) => t.seats));
const minSeats = Math.min(...event.tables.map((t) => t.seats));
const wholeTable = event.pricingMode === "whole-table";

/** بيحوّل الأرقام العربية (٠١٢…) لأرقام عادية وبيشيل الفراغات والشحطات */
function normalizePhone(raw: string) {
  return raw
    .replace(/[٠-٩]/g, (c) => String(c.charCodeAt(0) - 0x0660))
    .replace(/[۰-۹]/g, (c) => String(c.charCodeAt(0) - 0x06f0))
    .replace(/[^\d+]/g, "");
}

function validPhone(raw: string) {
  const p = normalizePhone(raw);
  return /^(?:\+?97[02]|0)5\d{8}$/.test(p) || /^\+\d{8,15}$/.test(p);
}

function guestsLabel(n: number) {
  if (n === 1) return "شخص واحد";
  if (n === 2) return "شخصين";
  return n <= 10 ? `${n} أشخاص` : `${n} شخص`;
}

type Errors = Partial<Record<"name" | "phone" | "email", string>>;

export default function Booking() {
  const [guests, setGuests] = useState<number | null>(null);
  const [table, setTable] = useState<HallTable | null>(null);
  const [sent, setSent] = useState<string | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const mapRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastTableBtn = useRef<HTMLButtonElement | null>(null);
  const titleId = useId();

  const bestFit =
    guests === null
      ? null
      : Math.min(...event.tables.filter((t) => t.seats >= guests && !booked.has(t.id)).map((t) => t.seats));

  const chooseGuests = (n: number) => {
    setGuests(n);
    setTable(null);
    // على الموبايل بننزل للخريطة بعد ما يختار العدد
    if (window.matchMedia("(max-width: 760px)").matches) {
      setTimeout(() => mapRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 120);
    }
  };

  const openTable = (t: HallTable, btn: HTMLButtonElement) => {
    lastTableBtn.current = btn;
    setErrors({});
    setSent(null);
    setTable(t);
    track("InitiateCheckout", { value: tablePrice(t.seats, guests ?? t.seats), currency: "ILS" });
  };

  const close = useCallback(() => {
    setTable(null);
    setSent(null);
    lastTableBtn.current?.focus();
  }, []);

  // سكّر بـ Esc، اقفل سكرول الصفحة، وخلي التنقل بـ Tab جوا الشباك
  useEffect(() => {
    if (!table) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const first = dialogRef.current?.querySelector<HTMLElement>("input, button");
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "Tab" && dialogRef.current) {
        const f = dialogRef.current.querySelectorAll<HTMLElement>("a[href], button, input, textarea");
        const a = f[0];
        const z = f[f.length - 1];
        if (e.shiftKey && document.activeElement === a) {
          e.preventDefault();
          z.focus();
        } else if (!e.shiftKey && document.activeElement === z) {
          e.preventDefault();
          a.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [table, close]);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!table || guests === null) return;
    const f = new FormData(e.currentTarget);
    const name = String(f.get("name") ?? "").trim();
    const phone = String(f.get("phone") ?? "").trim();
    const email = String(f.get("email") ?? "").trim();
    const notes = String(f.get("notes") ?? "").trim();

    const errs: Errors = {};
    if (name.length < 3) errs.name = "اكتب اسمك الكامل.";
    if (!validPhone(phone)) errs.phone = "اكتب رقم صحيح، مثلاً 0591234567.";
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "الإيميل مش مكتوب صح.";
    setErrors(errs);
    if (Object.keys(errs).length) {
      const firstBad = Object.keys(errs)[0];
      dialogRef.current?.querySelector<HTMLInputElement>(`[name="${firstBad}"]`)?.focus();
      return;
    }

    const price = tablePrice(table.seats, guests);
    const lines = [
      `مرحبا، بدي أحجز ل${event.titleAr} (${event.dateAr}).`,
      "",
      `الاسم: ${name}`,
      `التلفون: ${normalizePhone(phone)}`,
      email ? `الإيميل: ${email}` : null,
      `عدد الأشخاص: ${guests}`,
      `الطاولة: رقم ${table.id} (${table.seats} كراسي)`,
      `المبلغ: ${price} شيكل`,
      notes ? `ملاحظات: ${notes}` : null,
    ].filter((l) => l !== null);
    const url = whatsappLink(lines.join("\n"));
    track("Lead", { value: price, currency: "ILS", content_name: `Table ${table.id}` });
    setSent(url);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const price = table && guests !== null ? tablePrice(table.seats, guests) : 0;
  const step = table ? 3 : guests !== null ? 2 : 1;

  return (
    <div className="booking">
      <ol className="steps" aria-label="خطوات الحجز">
        {["عدد الأشخاص", "الطاولة", "بياناتك"].map((label, i) => (
          <li key={label} className={step > i + 1 ? "done" : step === i + 1 ? "active" : ""} aria-current={step === i + 1 ? "step" : undefined}>
            <span>{step > i + 1 ? <Icon name="check" size={14} /> : i + 1}</span>
            {label}
          </li>
        ))}
      </ol>

      {/* ===== الخطوة 1 ===== */}
      <div className="guest-step">
        <p className="step-label">الخطوة 1</p>
        <h3>كم شخص رح تكونوا؟</h3>
        <p className="step-help">بنعلّملك الطاولات اللي بتناسبكم.</p>
        <div className="guest-options" role="radiogroup" aria-label="عدد الأشخاص">
          {event.guestOptions.map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={guests === n}
              className={guests === n ? "selected" : ""}
              disabled={n > maxSeats}
              onClick={() => chooseGuests(n)}
            >
              <b>{n}</b>
              <span>{n === 2 ? "شخصين" : "أشخاص"}</span>
            </button>
          ))}
        </div>
        <p className="step-help small">
          أكثر من {maxSeats} أشخاص؟{" "}
          <a
            className="inline-link dark"
            href={whatsappLink(`مرحبا، بدنا نحجز لمجموعة أكبر من ${maxSeats} أشخاص ل${event.titleAr}.`)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("Contact")}
          >
            احكي معنا على واتساب
          </a>
        </p>
        {wholeTable && guests !== null && guests < minSeats && (
          <p className="notice" role="status">
            انتبهوا: أصغر طاولة {minSeats} أشخاص وبتنحسب كاملة، يعني {guestsLabel(guests)} بتدفعوا{" "}
            <b>{tablePrice(minSeats, guests)} شيكل</b>.
          </p>
        )}
      </div>

      {/* ===== الخطوة 2 ===== */}
      <div className="table-panel" ref={mapRef}>
        <div className="panel-title">
          <p>
            الخطوة 2 · خريطة القاعة · {event.tables.length} طاولات
          </p>
          <ul className="legend" aria-label="دليل الألوان">
            <li>
              <i className="dot fit" /> بتناسبكم
            </li>
            <li>
              <i className="dot best" /> الأنسب لعددكم
            </li>
            <li>
              <i className="dot taken" /> محجوزة
            </li>
          </ul>
        </div>

        <p className="map-hint" role="status">
          {guests === null
            ? "اختار عدد الأشخاص أول، بعدين اكبس على الطاولة اللي بدك إياها."
            : `اختار طاولة بتناسب ${guestsLabel(guests)}.${wholeTable ? " الطاولة بتنحسب كاملة." : ""}`}
        </p>

        <div className="hall" aria-label="خريطة القاعة">
          <div className="stage">المسرح · STAGE</div>
          <div className="floor">
            {event.tables.map((t) => {
              const isBooked = booked.has(t.id);
              const fits = guests !== null && t.seats >= guests && !isBooked;
              const best = fits && t.seats === bestFit;
              const p = tablePrice(t.seats, guests ?? t.seats);
              const cls = ["map-table", t.shape, isBooked ? "taken" : fits ? (best ? "fit best" : "fit") : guests !== null ? "too-small" : "idle"].join(" ");
              const label = isBooked
                ? `طاولة ${t.id}، ${t.seats} كراسي، محجوزة`
                : `طاولة ${t.id}، ${t.seats} كراسي، ${p} شيكل${guests !== null && !fits ? "، صغيرة على عددكم" : ""}`;
              return (
                <button
                  key={t.id}
                  type="button"
                  className={cls}
                  style={{ insetInlineStart: `${t.x}%`, top: `${t.y}%` }}
                  disabled={!fits}
                  aria-label={label}
                  onClick={(e) => openTable(t, e.currentTarget)}
                >
                  <b>{t.id}</b>
                  <span>{isBooked ? "محجوزة" : `${t.seats} كراسي`}</span>
                  {!isBooked && guests !== null && fits && <em>{p} ₪</em>}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ===== الخطوة 3: شباك الحجز ===== */}
      {table && guests !== null && (
        <div
          className="modal-backdrop"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div className="modal" role="dialog" aria-modal="true" aria-labelledby={titleId} ref={dialogRef}>
            <button type="button" className="modal-close" aria-label="سكّر" onClick={close}>
              <Icon name="close" size={22} />
            </button>

            {sent ? (
              <div className="sent">
                <span className="sent-icon">
                  <Icon name="check" size={28} />
                </span>
                <h3 id={titleId}>رسالتك جاهزة على واتساب</h3>
                <p>
                  اكبس <b>إرسال</b> بواتساب عشان يوصلنا الحجز، وبنرد عليك لنأكّد الطاولة{event.details.payment ? " ونرتب الدفع" : " وطريقة الدفع"}.
                </p>
                <p className="muted small">الحجز بيتأكد بس لما نرد عليك.</p>
                <a className="btn btn-gold" href={sent} target="_blank" rel="noopener noreferrer">
                  <Icon name="whatsapp" /> إذا ما انفتح واتساب، اكبس هون
                </a>
                <button type="button" className="btn btn-plain" onClick={close}>
                  رجوع للموقع
                </button>
              </div>
            ) : (
              <>
                <p className="modal-label">حجزك</p>
                <h3 id={titleId}>طاولة {table.id}</h3>
                <dl className="summary">
                  <div>
                    <dt>عدد الأشخاص</dt>
                    <dd>{guestsLabel(guests)}</dd>
                  </div>
                  <div>
                    <dt>كراسي الطاولة</dt>
                    <dd>{table.seats}</dd>
                  </div>
                  <div>
                    <dt>الحساب</dt>
                    <dd>
                      {wholeTable ? table.seats : guests} × {event.pricePerGuest} شيكل
                    </dd>
                  </div>
                </dl>
                <p className="total">
                  <span>المجموع</span>
                  <b>{price} شيكل</b>
                </p>
                {wholeTable && guests < table.seats && (
                  <p className="notice small">
                    عددكم {guests} والطاولة {table.seats} كراسي، فالطاولة بتنحسب كاملة.
                  </p>
                )}

                <form onSubmit={submit} noValidate>
                  <label>
                    <span>الاسم الكامل</span>
                    <input name="name" autoComplete="name" required aria-invalid={Boolean(errors.name)} />
                    {errors.name && <small className="err">{errors.name}</small>}
                  </label>
                  <label>
                    <span>رقم التلفون (واتساب)</span>
                    <input
                      name="phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      dir="ltr"
                      placeholder="059xxxxxxx"
                      required
                      aria-invalid={Boolean(errors.phone)}
                    />
                    {errors.phone && <small className="err">{errors.phone}</small>}
                  </label>
                  <label>
                    <span>
                      الإيميل <span className="opt">(اختياري)</span>
                    </span>
                    <input name="email" type="email" autoComplete="email" dir="ltr" aria-invalid={Boolean(errors.email)} />
                    {errors.email && <small className="err">{errors.email}</small>}
                  </label>
                  <label>
                    <span>
                      ملاحظات <span className="opt">(اختياري)</span>
                    </span>
                    <textarea name="notes" rows={2} placeholder="أولاد، كرسي أطفال، حساسية من أكل، مناسبة خاصة…" />
                  </label>
                  {event.details.payment && <p className="small muted">{event.details.payment}</p>}
                  <button type="submit" className="btn btn-gold btn-block">
                    <Icon name="whatsapp" /> ابعت الحجز على واتساب
                  </button>
                  <p className="small muted center">
                    رح ينفتح واتساب والرسالة جاهزة، بس اكبس إرسال. الحجز بيتأكد لما نرد عليك.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
