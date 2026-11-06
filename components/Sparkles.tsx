/**
 * ذرات ذهبية وثلج خفيف بيتحرك ورا العنوان. CSS بس، بدون JavaScript.
 * الأرقام ثابتة (مش عشوائية) عشان السيرفر والمتصفح يطلعوا نفس الشي.
 */
function seq(n: number, seed: number) {
  let x = seed;
  return Array.from({ length: n }, () => {
    x = (x * 9301 + 49297) % 233280;
    return x / 233280;
  });
}

export default function Sparkles({ count = 34 }: { count?: number }) {
  const r = seq(count * 5, 7);
  return (
    <div className="sparkles" aria-hidden>
      {Array.from({ length: count }, (_, i) => {
        const [a, b, c, d, e] = r.slice(i * 5, i * 5 + 5);
        const size = 2 + Math.round(a * 5);
        const style = {
          "--x": `${Math.round(b * 100)}%`,
          "--s": `${size}px`,
          "--dur": `${(9 + c * 12).toFixed(1)}s`,
          "--delay": `${(-d * 20).toFixed(1)}s`,
          "--drift": `${Math.round((e - 0.5) * 120)}px`,
          "--o": (0.35 + a * 0.55).toFixed(2),
        } as React.CSSProperties;
        return <i key={i} className={i % 4 === 0 ? "glow" : ""} style={style} />;
      })}
      <b className="bokeh b1" />
      <b className="bokeh b2" />
      <b className="bokeh b3" />
    </div>
  );
}
