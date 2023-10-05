import Navbar from "@/components/Navbar";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  applicationName: "weasker",
  authors: { name: "weasker team", url: "https://www.weasker.com" },
  title: "Weasker - Interviewing Experts",
  description:
    "We interview groups of experts and compare their answers, generating diverse and reliable information sources.",
  openGraph: {
    images: [
      "https://cdn.sanity.io/images/86a07a92/production/1e515c858d118200af9cec5e0c78a3dba499e5f8-1200x630.png",
    ],
    type: "website",
    url: `https://www.weasker.com`,
    title: `Weasker - Interviewing Experts`,
    description:
      "We interview groups of experts and compare their answers, generating diverse and reliable information sources",
    siteName: "weasker",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="top-0">
          <Navbar />
        </header>
        <main className="flex min-h-screen flex-col gap-8 items-center w-11/12 sm:max-w-7xl mx-auto">
          {children}
          <Analytics />
        </main>
        <footer>
          <Footer />
        </footer>
      </body>
    </html>
  );
}
