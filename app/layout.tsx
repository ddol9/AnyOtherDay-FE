import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "어느날 - 치매 예방 탐지 서비스",
  description: "전화통화로 건강을 지키는 AI 케어",
  generator: "v0.app",
  manifest: "/manifest.json",
  icons: {
    icon: [
      {
        url: "/favicon.png",
        type: "image/png",
      },
      {
        url: "/icon-light-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/icon.png",
        type: "image/png",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" style={{ scrollbarGutter: "stable" }}>
      <body className="antialiased overflow-x-hidden">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
