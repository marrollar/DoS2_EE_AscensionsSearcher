import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import Footer from "./components/Footer";
import Header from "./components/Header";
import KeyWordsContext from "./components/KeywordsContext";
import "./globals.css";
import { getKeywordDescriptions } from "./db/queries";

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


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const keywords_descriptions = await getKeywordDescriptions();

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
              <KeyWordsContext kw_descs={keywords_descriptions}>
                {children}
              </KeyWordsContext>
            </div>
            <Footer />
          </div>
        </NuqsAdapter>
      </body>
    </html>
  );
}
