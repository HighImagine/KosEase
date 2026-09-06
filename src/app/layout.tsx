import type { Metadata } from "next";
import { Geist, Rubik } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KosEase",
  description: "Platform reservasi dan manajemen rumah kos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geist.variable} ${rubik.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}