import type { Metadata, Viewport } from "next";
import { Cairo } from "next/font/google";
import { MotionProvider, ScrollProgress } from "./Motion";
import "./globals.css";

// Cairo: variable Arabic + Latin font (supports every weight used: light → semibold)
const cairo = Cairo({ subsets: ["arabic", "latin"], variable: "--font-cairo", display: "swap" });

export const metadata: Metadata = {
  title: "LUMORA — شامبو ضد تساقط الشعر بمكونات طبيعية | بدون سلفات",
  description:
    "شامبو LUMORA ضد تساقط الشعر: زيت أزير، جل الصبار، برو فيتامين B5، البصل والجنسينغ. بدون سلفات، صنع في المغرب. 150 مل.",
  openGraph: {
    title: "LUMORA — شامبو ضد تساقط الشعر",
    description: "يقوّي الجذور ويغذي فروة الرأس بعمق. بدون سلفات.",
    locale: "ar_MA",
    type: "website",
  },
};
export const viewport: Viewport = { themeColor: "#0b2a1f" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <body>
        <MotionProvider>
          <ScrollProgress />
          {children}
        </MotionProvider>
      </body>
    </html>
  );
}