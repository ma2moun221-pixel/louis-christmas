import { event, type GalleryItem } from "@/lib/event";

function Media({ item }: { item: GalleryItem }) {
  if (item.type === "video") {
    return (
      <video
        src={item.src}
        poster={item.poster}
        muted
        loop
        playsInline
        autoPlay
        preload="none"
        aria-label={item.alt}
      />
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={item.src} alt={item.alt} loading="lazy" decoding="async" />;
}

/** شريطين لقطات بيتحركوا عكس بعض. بيظهر بس إذا في لقطات بـ lib/event.ts */
export default function Gallery() {
  const items = event.gallery;
  const reel = event.reel;
  if (items.length === 0 && !reel) return null;
  const half = Math.ceil(items.length / 2);
  const rows = items.length >= 6 ? [items.slice(0, half), items.slice(half)] : [items];

  return (
    <section className="section section-deep gallery-section" id="moments" aria-labelledby="gallery-title">
      <div className="shell center" data-reveal="up">
        <p className="label">لقطات · Moments</p>
        <h2 id="gallery-title">
          من <em>سهرات لويس</em> السابقة.
        </h2>
        <p className="lead">هيك بيكون الجو لما يكون {event.artists.find((a) => a.roleEn === "DJ")?.nameAr} ع الدي جي.</p>
      </div>
      {reel && (
        <div className="shell reel-player" data-reveal="zoom">
          <video src={reel.src} poster={reel.poster} controls playsInline preload="none" aria-label={reel.title} />
          <p className="reel-caption">
            <span className="rec" aria-hidden /> {reel.title} · شغّل الصوت
          </p>
        </div>
      )}
      <div className="reels">
        {rows.map((row, r) => (
          <div className={`reel${r === 1 ? " reverse" : ""}`} key={r}>
            {/* القائمة مكررة مرتين عشان الحركة تضل ماشية بدون قطع */}
            <ul>
              {[...row, ...row].map((item, i) => (
                <li key={i} aria-hidden={i >= row.length}>
                  <Media item={item} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
