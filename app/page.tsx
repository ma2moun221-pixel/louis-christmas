import Header from "@/components/Header";
import Countdown from "@/components/Countdown";
import Booking from "@/components/Booking";
import StickyCta from "@/components/StickyCta";
import ContactLink from "@/components/ContactLink";
import Sparkles from "@/components/Sparkles";
import ScrollReveal from "@/components/ScrollReveal";
import Gallery from "@/components/Gallery";
import { Icon } from "@/components/Icons";
import { asset } from "@/lib/asset";
import { availableTables, enquiryText, event, minTableSize, tablePrice, tableSizes, whatsappLink } from "@/lib/event";

const d = event.details;
const [singer, dj] = event.artists;

function faqItems() {
  const wholeTable = event.pricingMode === "whole-table";
  const priceList = tableSizes.map((s) => `طاولة ${s} أشخاص = ${tablePrice(s, s)} شيكل`).join("، ");
  const items: { q: string; a: string | null }[] = [
    {
      q: "قديش سعر الحجز؟",
      a: wholeTable
        ? `${event.pricePerGuest} شيكل للشخص، والحجز بالطاولة الكاملة: ${priceList}. إذا عددكم أقل من كراسي الطاولة، بتنحسب الطاولة كاملة.`
        : `${event.pricePerGuest} شيكل للشخص، وبتدفعوا حسب عددكم بس.`,
    },
    { q: "شو بيشمل السعر؟", a: `العشاء والسهرة مع ${singer.nameAr} و${dj.roleAr} ${dj.nameAr}.${d.drinks ? " " + d.drinks : ""}` },
    { q: "إيمتى بتبلش السهرة وإيمتى بتخلص؟", a: `الأبواب بتفتح ${event.doorsAr}، ${event.dateAr}.${d.endTime ? " " + d.endTime : ""}` },
    { q: "وين الحفلة؟", a: `${event.venue.nameAr}، ${event.venue.cityAr}. الموقع على الخريطة موجود تحت.` },
    { q: "كيف بحجز؟", a: "اختار عدد الأشخاص، بعدين اختار الطاولة من خريطة القاعة، واكتب اسمك ورقمك. رح ينفتح واتساب والرسالة جاهزة، بس اكبس إرسال، وبنرد عليك لنأكد الحجز." },
    { q: "شو في عشاء؟", a: d.menu },
    { q: "المشروبات مشمولة؟", a: d.drinks },
    { q: "في سعر خاص للأولاد؟", a: d.kids },
    { q: "كيف بدفع؟", a: d.payment },
    { q: "لإيمتى بقدر أحجز؟", a: d.deadline },
    { q: "إذا صار معي إشي، بقدر ألغي؟", a: d.cancellation },
    { q: "في مواقف سيارات؟", a: d.parking },
    { q: "في لبس معيّن؟", a: d.dressCode },
  ];
  return items.filter((i): i is { q: string; a: string } => Boolean(i.a));
}

export default function Home() {
  const left = availableTables.length;
  const total = event.tables.length;
  const enquiry = whatsappLink(enquiryText);

  return (
    <>
      <div className="backdrop" aria-hidden style={{ backgroundImage: `url(${asset("/christmas-velvet.webp")})` }} />
      <Header />

      <main id="top">
        {/* ======== HERO ======== */}
        <section className={`hero${event.heroVideo ? " has-video" : ""}`}>
          {event.heroVideo && (
            <video
              className="hero-video"
              src={event.heroVideo}
              poster={event.heroPoster ?? undefined}
              muted
              loop
              playsInline
              autoPlay
              preload="metadata"
              aria-hidden
              tabIndex={-1}
            />
          )}
          <Sparkles />
          <div className="shell hero-inner">
            <p className="overline enter" style={{ "--i": 0 } as React.CSSProperties}>
              <span>Full Volume Events by Louis</span> بتقدّم
            </p>
            <h1>
              <span className="word enter" style={{ "--i": 1 } as React.CSSProperties}>
                سهرة
              </span>{" "}
              <em className="word enter shimmer" style={{ "--i": 2 } as React.CSSProperties}>
                عيد الميلاد
              </em>
            </h1>
            <p className="hero-en enter" lang="en" dir="ltr" style={{ "--i": 3 } as React.CSSProperties}>
              {event.titleEn}
            </p>

            <ul className="event-facts enter" aria-label="تفاصيل الحفلة" style={{ "--i": 4 } as React.CSSProperties}>
              <li>
                <Icon name="calendar" />
                <span>{event.dateAr}</span>
              </li>
              <li>
                <Icon name="clock" />
                <span>الأبواب بتفتح {event.doorsAr}</span>
              </li>
              <li>
                <Icon name="pin" />
                <a href={event.venue.mapUrl} target="_blank" rel="noopener noreferrer">
                  {event.venue.nameAr}، {event.venue.cityAr} <span aria-hidden>↗</span>
                </a>
              </li>
            </ul>

            <p className={`hero-lead enter${event.artists.some((a) => a.photo) ? " has-lineup" : ""}`} style={{ "--i": 5 } as React.CSSProperties}>
              سهرة مع الفنان {singer.nameAr} و{dj.roleAr} {dj.nameAr}، والعشاء مشمول.
            </p>
            <p className="hero-lead-en" lang="en" dir="ltr">
              An evening with singer {singer.nameEn} and {dj.nameEn}, with dinner included.
            </p>

            {event.artists.some((a) => a.photo) && (
              <a className="lineup enter" href="#artists" style={{ "--i": 5 } as React.CSSProperties}>
                <span className="faces">
                  {event.artists
                    .filter((a) => a.photo)
                    .map((a) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img key={a.nameEn} src={a.photo!} alt="" width={52} height={52} />
                    ))}
                </span>
                <span>
                  <span className="names">
                    <b>{singer.nameAr}</b> و <b>{dj.roleAr} {dj.nameAr}</b>
                  </span>
                  <small>لايف · العشاء مشمول</small>
                </span>
              </a>
            )}

            <div className="enter" style={{ "--i": 6 } as React.CSSProperties}>
              <Countdown />
            </div>

            <div className="hero-actions enter" style={{ "--i": 7 } as React.CSSProperties}>
              <a className="btn btn-gold" href="#tables">
                اختار طاولتك <Icon name="arrow" />
              </a>
              <ContactLink className="btn btn-ghost" href={enquiry}>
                <Icon name="whatsapp" /> اسأل على واتساب
              </ContactLink>
            </div>

            <p className="hero-stock enter" style={{ "--i": 8 } as React.CSSProperties}>
              {left > 0 ? (
                <>
                  <strong>
                    {left === 1 ? "باقي طاولة وحدة" : left === 2 ? "باقي طاولتين" : `باقي ${left} ${left <= 10 ? "طاولات" : "طاولة"}`}
                  </strong>{" "}
                  من {total} · {event.pricePerGuest} شيكل للشخص
                </>
              ) : (
                <strong>كل الطاولات انحجزت. ابعتلنا على واتساب لقائمة الانتظار.</strong>
              )}
            </p>
          </div>
          <a className="hero-scroll" href="#about" aria-label="انزل لتحت">
            <span />
          </a>
        </section>

        {/* ======== شريط متحرك ======== */}
        <div className="ribbon" aria-hidden>
          <div className="ribbon-track">
            {Array.from({ length: 2 }, (_, k) => (
              <span key={k}>
                {["عيد الميلاد", "Full Volume", "بيت لحم", "25.12", singer.nameAr, dj.nameAr, "Christmas Celebration", "العشاء مشمول"].map((w) => (
                  <span key={w}>
                    {w} <i>✦</i>{" "}
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>

        {/* ======== INVITATION ======== */}
        <section className="section section-wine" id="about">
          <div className="shell narrow center" data-reveal="up">
            <p className="label">الدعوة · The Invitation</p>
            <h2>
              عيد الميلاد، <em>بأحلى ضيافة.</em>
            </h2>
            <p className="lead">
              {event.brand} بتعزمكم على سهرة كل إشي فيها جاهز: الطاولة محضّرة، الموسيقى جاهزة، وجو العيد قريب.
            </p>
            <div className="divider" aria-hidden>
              <Icon name="sparkle" />
            </div>
            <p className="muted">للعائلات والأزواج والأصحاب اللي بدهم سهرة غير عن كل سنة.</p>
            <p className="en-line" lang="en" dir="ltr">
              Christmas, beautifully hosted. For families, couples and friends who want more than an ordinary night out.
            </p>
          </div>
        </section>

        {/* ======== ARTISTS ======== */}
        <section className="section section-deep" id="artists">
          <div className="shell center">
            <div data-reveal="up">
              <p className="label">نجوم السهرة · Live</p>
              <h2>
                صوت <em>وإيقاع</em> العيد.
              </h2>
            </div>
            <div className="artists">
              {event.artists.map((a, idx) => (
                <article className={`artist ${a.roleEn === "DJ" ? "is-dj" : "is-singer"}`} key={a.nameEn} data-reveal="zoom" data-delay={idx * 160}>
                  <div className={`artist-photo${a.photo ? " has-photo" : ""}`}>
                    {a.photo ? (
                      <span className="portrait">
                        {a.roleEn === "DJ" ? <span className="vinyl behind" aria-hidden /> : <span className="waves" aria-hidden><i /><i /><i /></span>}
                        <span className="ring" aria-hidden />
                        <span className="frame">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={a.photo} alt={`${a.roleAr} ${a.nameAr}`} loading="lazy" />
                        </span>
                      </span>
                    ) : a.roleEn === "DJ" ? (
                      <span className="vinyl" aria-hidden>
                        <span className="vinyl-label">FV</span>
                      </span>
                    ) : (
                      <span className="mic-glow" aria-hidden>
                        <Icon name="mic" size={64} />
                      </span>
                    )}
                    <span className="eq" aria-hidden>
                      {Array.from({ length: 12 }, (_, k) => (
                        <i key={k} style={{ "--k": k } as React.CSSProperties} />
                      ))}
                    </span>
                  </div>
                  <p className="artist-role">
                    {a.roleAr} · <span lang="en">{a.roleEn}</span>
                  </p>
                  <h3>{a.nameAr}</h3>
                  <p className="artist-en" lang="en" dir="ltr">
                    {a.nameEn}
                  </p>
                  {a.instagram && (
                    <a className="text-link" href={a.instagram} target="_blank" rel="noopener noreferrer">
                      <Icon name="instagram" /> إنستغرام
                    </a>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>

        <Gallery />

        {/* ======== PROGRAM ======== */}
        <section className="section section-wine" id="experience">
          <div className="shell center">
            <div data-reveal="up">
              <p className="label">برنامج السهرة · The Evening</p>
              <h2>
                تعالوا عشان <em>الجو</em>،<br />
                وضلّوا عشان الذكريات.
              </h2>
            </div>
            <div className="moments">
              <article data-reveal="up">
                <span className="num">01</span>
                <Icon name="clock" />
                <h3>الاستقبال</h3>
                <p>
                  الأبواب بتفتح {event.doorsAr} ب{event.venue.nameAr}.
                </p>
              </article>
              <article data-reveal="up" data-delay="140">
                <span className="num">02</span>
                <Icon name="dinner" />
                <h3>العشاء</h3>
                <p>{d.menu ?? "العشاء مشمول بسعر الحجز."}</p>
              </article>
              <article data-reveal="up" data-delay="280">
                <span className="num">03</span>
                <Icon name="music" />
                <h3>السهرة</h3>
                <p>
                  الفنان {singer.nameAr} و{dj.roleAr} {dj.nameAr}.{d.endTime ? " " + d.endTime : ""}
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* ======== TABLES ======== */}
        <section className="section section-wine tables-section" id="tables">
          <div className="shell">
            <div className="center" data-reveal="up">
              <p className="label">حجز الطاولات · Table Reservations</p>
              <h2>
                مكانك <em>بالسهرة.</em>
              </h2>
              <p className="lead">اختار طاولة على مزاجك، واختار وين بتحب قعدتك.</p>
            </div>

            <div className="price-card" data-reveal="zoom">
              <div className="price-main">
                <strong>{event.pricePerGuest}</strong>
                <span>
                  شيكل للشخص
                  <br />
                  العشاء مشمول
                </span>
              </div>
              {event.pricingMode === "whole-table" ? (
                <div className="price-rule">
                  <p>
                    <b>الحجز بالطاولة الكاملة.</b> أصغر طاولة {minTableSize} أشخاص، وإذا عددكم أقل بتنحسب الطاولة كاملة.
                  </p>
                  <ul>
                    {tableSizes.map((s) => (
                      <li key={s}>
                        طاولة {s} أشخاص <b>{tablePrice(s, s)} شيكل</b>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="price-rule">
                  <p>
                    <b>بتدفعوا حسب عددكم بس.</b> مثلاً 4 أشخاص = {4 * event.pricePerGuest} شيكل.
                  </p>
                </div>
              )}
            </div>

            <Booking />
          </div>
        </section>

        {/* ======== FAQ ======== */}
        <section className="section section-deep" id="faq">
          <div className="shell narrow">
            <div className="center" data-reveal="up">
              <p className="label">أسئلة بتتكرر · FAQ</p>
              <h2>
                كل اللي <em>بدك تعرفه.</em>
              </h2>
            </div>
            <div className="faq" data-reveal="up">
              {faqItems().map((i) => (
                <details key={i.q}>
                  <summary>{i.q}</summary>
                  <p>{i.a}</p>
                </details>
              ))}
            </div>
            <p className="center muted faq-more">
              ما لقيت جوابك؟{" "}
              <ContactLink className="inline-link" href={enquiry}>
                اسألنا على واتساب
              </ContactLink>
            </p>
          </div>
        </section>

        {/* ======== STAYS (بيظهر بس إذا في فنادق) ======== */}
        {event.hotels.length > 0 && (
          <section className="section section-forest" id="stay">
            <div className="shell center">
              <p className="label">الإقامة · Stays</p>
              <h2>
                نام <em>قريب من السهرة.</em>
              </h2>
              <div className="hotels">
                {event.hotels.map((h) => (
                  <article key={h.name} className="hotel">
                    <h3>{h.name}</h3>
                    {h.distance && <p className="muted">{h.distance}</p>}
                    {h.phone && (
                      <a href={`tel:${h.phone.replace(/[^\d+]/g, "")}`} dir="ltr">
                        {h.phone}
                      </a>
                    )}
                    {h.link && (
                      <a className="text-link" href={h.link} target="_blank" rel="noopener noreferrer">
                        التفاصيل ↗
                      </a>
                    )}
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ======== CONTACT / LOCATION ======== */}
        <section className="section section-forest" id="contact">
          <div className="shell contact-grid">
            <div data-reveal="side">
              <p className="label">تواصل معنا · Contact</p>
              <h2>
                عندك <em>سؤال؟</em>
              </h2>
              <p className="lead">احكي معنا مباشرة على واتساب أو اتصل.</p>
              <div className="contact-actions">
                <ContactLink className="btn btn-gold" href={enquiry}>
                  <Icon name="whatsapp" /> واتساب
                </ContactLink>
                <a className="btn btn-ghost" href={`tel:+${event.contact.whatsapp}`}>
                  <Icon name="phone" /> <span dir="ltr">{event.contact.phoneDisplay}</span>
                </a>
              </div>
            </div>
            <div className="venue-card" data-reveal="zoom" data-delay="120">
              {event.venue.photo && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={event.venue.photo} alt={event.venue.nameAr} loading="lazy" />
              )}
              <Icon name="pin" />
              <h3>{event.venue.nameAr}</h3>
              <p className="muted">
                {event.venue.cityAr} · <span lang="en">{event.venue.nameEn}, {event.venue.cityEn}</span>
              </p>
              <p className="muted">
                {event.dateAr} · الأبواب {event.doorsAr}
              </p>
              <a className="btn btn-wine" href={event.venue.mapUrl} target="_blank" rel="noopener noreferrer">
                افتح الموقع على الخريطة <span aria-hidden>↗</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="shell footer-inner">
          <a className="brand" href="#top" aria-label="Full Volume Events by Louis">
            <small>FULL</small>
            <b>VOLUME</b>
            <span>EVENTS BY LOUIS</span>
          </a>
          <p lang="en" dir="ltr">
            CHRISTMAS CELEBRATION · BETHLEHEM · 25.12.2026
          </p>
          <nav className="social" aria-label="روابط التواصل">
            <ContactLink href={enquiry}>
              <Icon name="whatsapp" /> واتساب
            </ContactLink>
            <a href={event.contact.instagram} target="_blank" rel="noopener noreferrer">
              <Icon name="instagram" /> إنستغرام
            </a>
            <a href={event.contact.facebook} target="_blank" rel="noopener noreferrer">
              <Icon name="facebook" /> فيسبوك
            </a>
            <a href={event.venue.mapUrl} target="_blank" rel="noopener noreferrer">
              <Icon name="pin" /> الموقع
            </a>
          </nav>
          <a className="to-top" href="#top">
            لفوق ↑
          </a>
        </div>
      </footer>

      <StickyCta />
      <ScrollReveal />
    </>
  );
}
