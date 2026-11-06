import { asset } from "./asset";

/**
 * كل معلومات الحفلة بمكان واحد.
 *
 * أي قيمة null = المعلومة مش معروفة لسا، وبتضل مخفية من الموقع لحد ما تعبّيها.
 * لا تحط معلومة مش مؤكدة من صاحب الحفلة.
 */

export type TableShape = "round" | "rect";

export interface HallTable {
  id: number;
  seats: number;
  shape: TableShape;
  /** مكان الطاولة على خريطة القاعة، بالنسبة المئوية من اليمين ومن فوق */
  x: number;
  y: number;
}

export interface Artist {
  nameAr: string;
  nameEn: string;
  roleAr: string;
  roleEn: string;
  /** مسار صورة داخل مجلد public، مثلاً "/artists/zuhair.webp". null = بدون صورة */
  photo: string | null;
  instagram: string | null;
}

export interface GalleryItem {
  type: "image" | "video";
  src: string;
  /** صورة بتظهر قبل ما يشتغل الفيديو */
  poster?: string;
  alt: string;
}

export interface Hotel {
  name: string;
  distance: string | null;
  phone: string | null;
  link: string | null;
}

export const event = {
  /** رابط الموقع النهائي (بدون / بالآخر). غيّره إذا صار في دومين خاص */
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://louischrismas-pvfaq.ondigitalocean.app",

  brand: "Full Volume Events by Louis",
  titleAr: "سهرة عيد الميلاد",
  titleEn: "Christmas Celebration",

  /** وقت فتح الأبواب، بتوقيت فلسطين */
  startsAt: "2026-12-25T19:30:00+02:00",
  dateAr: "الجمعة 25 كانون الأول 2026",
  dateEn: "Friday, 25 December 2026",
  doorsAr: "7:30 مساءً",
  doorsEn: "7:30 PM",

  venue: {
    nameAr: "قاعة سعادة",
    nameEn: "Saadeh Hall",
    cityAr: "بيت لحم",
    cityEn: "Bethlehem",
    mapUrl: "https://maps.app.goo.gl/kJyVrn4g1wZAUZNS7",
    /** صورة للقاعة داخل public. null = بدون صورة */
    photo: null as string | null,
  },

  /** السعر بالشيكل */
  pricePerGuest: 300,
  /**
   * "whole-table" = الطاولة بتنحسب كاملة حسب عدد كراسيها (مثل الموقع الأصلي)
   * "per-seat"    = كل مجموعة بتدفع حسب عدد أشخاصها بس
   */
  pricingMode: "whole-table" as "whole-table" | "per-seat",

  guestOptions: [2, 3, 4, 5, 6, 7, 8, 9, 10],

  tables: [
    { id: 1, seats: 6, shape: "round", x: 16, y: 22 },
    { id: 2, seats: 6, shape: "round", x: 50, y: 22 },
    { id: 3, seats: 8, shape: "round", x: 84, y: 22 },
    { id: 4, seats: 8, shape: "round", x: 14, y: 54 },
    { id: 5, seats: 10, shape: "rect", x: 50, y: 54 },
    { id: 6, seats: 8, shape: "round", x: 86, y: 54 },
    { id: 7, seats: 6, shape: "round", x: 28, y: 85 },
    { id: 8, seats: 10, shape: "rect", x: 70, y: 85 },
  ] satisfies HallTable[],

  /** أرقام الطاولات المحجوزة. كل ما تنحجز طاولة ضيف رقمها هون، مثلاً [3, 5] */
  bookedTables: [] as number[],

  contact: {
    /** رقم واتساب بالصيغة الدولية بدون + */
    whatsapp: "972592033342",
    phoneDisplay: "059-203-3342",
    instagram: "https://www.instagram.com/iam_djlouis/",
    facebook: "https://www.facebook.com/TanasLouis",
  },

  artists: [
    {
      nameAr: "زهير فرنسيس",
      nameEn: "Zuhair Francis",
      roleAr: "مطرب",
      roleEn: "Singer",
      photo: asset("/artists/zuhair.webp"),
      instagram: "https://www.instagram.com/zuhairfrancis/",
    },
    {
      nameAr: "لويس طناس",
      nameEn: "DJ Louis Tanas",
      roleAr: "دي جي",
      roleEn: "DJ",
      photo: asset("/artists/louis.webp"),
      instagram: "https://www.instagram.com/iam_djlouis/",
    },
  ] satisfies Artist[],

  /**
   * معلومات ناقصة. كل وحدة null بتضل مخفية.
   * لما تعرفها اكتبها كجملة جاهزة للنشر، مثلاً:
   * endTime: "السهرة بتخلص الساعة 1:00 بعد نص الليل."
   */
  details: {
    endTime: null as string | null,
    menu: null as string | null,
    drinks: null as string | null,
    kids: null as string | null,
    payment: null as string | null,
    deadline: null as string | null,
    cancellation: null as string | null,
    parking: null as string | null,
    dressCode: null as string | null,
  },

  /**
   * لقطات من حفلات سابقة (صور أو فيديوهات قصيرة) لقسم "لقطات".
   * حط الملفات بمجلد public/media وضيفها هون. إذا القائمة فاضية القسم بيختفي.
   * مثال: { type: "image", src: asset("/media/louis-1.webp"), alt: "دي جي لويس بحفلة رأس السنة" }
   *       { type: "video", src: asset("/media/zuhair-1.mp4"), poster: asset("/media/zuhair-1.webp"), alt: "زهير فرنسيس على المسرح" }
   * استخدم بس صور وفيديوهات صاحبها موافق على نشرها.
   */
  gallery: [
    { type: "image", src: asset("/media/moment-1.webp"), alt: "الدخلة على الدرج مع الكونفيتي · سهرة سابقة مع دي جي لويس طناس" },
    { type: "image", src: asset("/media/moment-2.webp"), alt: "القاعة مليانة والناس بتحتفل · سهرة سابقة مع دي جي لويس طناس" },
    { type: "image", src: asset("/media/moment-3.webp"), alt: "فقرة غنا بين الطاولات · سهرة سابقة مع دي جي لويس طناس" },
    { type: "image", src: asset("/media/moment-4.webp"), alt: "الطاولات والبالونات والجو حلو · سهرة سابقة مع دي جي لويس طناس" },
    { type: "image", src: asset("/media/moment-5.webp"), alt: "من ورا الكيبورد على القاعة · سهرة سابقة مع دي جي لويس طناس" },
    { type: "image", src: asset("/media/moment-6.webp"), alt: "أضواء آخر السهرة · سهرة سابقة مع دي جي لويس طناس" },
    { type: "image", src: asset("/media/moment-7.webp"), alt: "استقبال بين الطاولات · سهرة سابقة مع دي جي لويس طناس" },
    { type: "image", src: asset("/media/moment-8.webp"), alt: "من المسرح على القاعة · سهرة سابقة مع دي جي لويس طناس" },
    { type: "image", src: asset("/media/moment-9.webp"), alt: "الكيبورد شغّال · سهرة سابقة مع دي جي لويس طناس" },
    { type: "image", src: asset("/media/moment-10.webp"), alt: "ليزر وأضواء على الحلبة · سهرة سابقة مع دي جي لويس طناس" },
    { type: "image", src: asset("/media/moment-11.webp"), alt: "القاعة من فوق · سهرة سابقة مع دي جي لويس طناس" },
    { type: "image", src: asset("/media/moment-12.webp"), alt: "أضواء بنفسجية وآخر السهرة · سهرة سابقة مع دي جي لويس طناس" },
  ] as GalleryItem[],

  /** فيديو كامل من سهرة سابقة بصوت، بيظهر بقسم "لقطات" مع زر تشغيل. null = بدون */
  reel: {
    src: asset("/media/louis-reel.mp4"),
    poster: asset("/media/louis-reel-poster.webp"),
    title: "أجواء سهرة مع دي جي لويس طناس",
  } as { src: string; poster: string; title: string } | null,

  /** فيديو قصير (mp4، بدون صوت، أقل من 5 ميغا) يلعب ورا العنوان بأول شاشة. null = الخلفية العادية */
  heroVideo: asset("/media/hero-loop.mp4") as string | null,
  heroPoster: asset("/media/hero-poster.webp") as string | null,

  /** فنادق قريبة. لما تكون فاضية قسم الإقامة بيختفي */
  hotels: [] as Hotel[],

  /** أرقام التتبع. null = مش مفعّل */
  metaPixelId: null as string | null,
  googleAnalyticsId: null as string | null,
};

export const availableTables = event.tables.filter(
  (t) => !event.bookedTables.includes(t.id),
);

export function tablePrice(seats: number, guests: number): number {
  return event.pricingMode === "whole-table"
    ? seats * event.pricePerGuest
    : guests * event.pricePerGuest;
}

export const tableSizes = [...new Set(event.tables.map((t) => t.seats))].sort(
  (a, b) => a - b,
);

export const minTableSize = tableSizes[0];

export function whatsappLink(text: string): string {
  return `https://wa.me/${event.contact.whatsapp}?text=${encodeURIComponent(text)}`;
}

export const enquiryText = `مرحبا، عندي سؤال عن ${event.titleAr} يوم ${event.dateAr} بـ${event.venue.nameAr}.`;
