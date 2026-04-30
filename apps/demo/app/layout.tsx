import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kostiantyn Keilin — Recommendations",
  description: "LinkedIn recommendations for Kostiantyn Keilin, Senior Front-End Engineer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <title>Kostiantyn Keilin — Recommendations</title>
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            var mq = window.matchMedia('(prefers-color-scheme: dark)');
            function sync(e) { document.documentElement.classList.toggle('dark', e.matches); }
            sync(mq);
            mq.addEventListener('change', sync);
          })();
        ` }} />
      </head>
      <body suppressHydrationWarning className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
