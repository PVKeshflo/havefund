import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  weight: ["400", "600", "700", "900"],
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GoHaveFund — Fundraising Intelligence for Founders",
  description:
    "Craft investor communications, discover VCs, research markets, and stress-test your value proposition.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={outfit.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body className="relative overflow-x-hidden">
        {/* Geometric background pattern */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/bg-shapes.svg"
          alt=""
          aria-hidden="true"
          className="fixed top-6 right-6 w-[320px] opacity-[0.07] pointer-events-none select-none z-0"
        />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
