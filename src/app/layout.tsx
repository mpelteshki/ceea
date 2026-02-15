import type { Metadata } from "next";
import { Syne, Spline_Sans, Spline_Sans_Mono } from "next/font/google";
import "./globals.css";

const display = Syne({
  variable: "--font-display",
  subsets: ["latin"],
});

const body = Spline_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

const mono = Spline_Sans_Mono({
  variable: "--font-body-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CEEA Bocconi",
  description:
    "Central & Eastern European Association at Bocconi University. Culture, careers, and community across the region.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${display.variable} ${body.variable} ${mono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
