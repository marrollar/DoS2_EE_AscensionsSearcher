import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavBar from "@/app/components/NavBar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DOS 2 EE Ascensions Searcher",
  description: "Web interface to quickly search Epic Encounter ascensions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased`}
      >
        <div className="flex flex-col w-[100%] max-w-[1100px] mx-auto my-2 px-1 py-1 rounded-lg shadow-md bg-gray-700">
          <NavBar />
          {children}
        </div>
      </body>
    </html>
  );
}
