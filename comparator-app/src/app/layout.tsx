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
  title: "Comparator",
  description: "Comparing two sets of blocks",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <style>
          {`
            :root {
              --background-color: #0a192f;
              --glow-color: #0cdcf7;
              --box-color: #64ffda;
              --box-shadow-color: rgba(12, 220, 247, 0.3);
            }
            
            body {
              background: var(--background-color);
              color: var(--glow-color);
              min-height: 100vh;
              margin: 0;
              padding: 0;
            }
          `}
        </style>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
