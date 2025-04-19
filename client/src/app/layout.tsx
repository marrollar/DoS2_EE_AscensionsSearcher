import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "./components/Header";
import "./globals.css";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import Footer from "./components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DOS 2 EE Ascensions Searcher",
  description: "Web interface to quickly search Epic Encounter ascensions.",
  alternates: {
    canonical: process.env.NEXT_PUBLIC_BASE_PATH
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={`${inter.variable} antialiased`}>
        <NuqsAdapter>
          <div className="min-h-screen flex flex-col">
            <Header />
            <div className="flex-grow">
              {children}
            </div>
            <Footer />
          </div>
        </NuqsAdapter>
      </body>
    </html>
  );
}
