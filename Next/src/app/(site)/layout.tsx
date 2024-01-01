import Navbar from "@/components/Navbar";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Noto_Sans } from "next/font/google";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/react";
import { defaultImages } from "@/utils/defaultImages";

const inter = Inter({ subsets: ["latin"] });
const noto_Sans = Noto_Sans({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  applicationName: process.env.SITE_NAME,
  authors: { name: "weasker team", url: process.env.SITE_URL },
  title: "Weasker - Interviewing Experts",
  description:
    "We interview groups of experts and compare their answers, generating diverse and reliable information sources.",
  openGraph: {
    images: [defaultImages.defaultOgImage],
    type: "website",
    url: process.env.SITE_URL,
    title: `Weasker - Interviewing Experts`,
    description:
      "We interview groups of experts and compare their answers, generating diverse and reliable information sources",
    siteName: process.env.SITE_NAME,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`bg-[#F4F4F4] ${noto_Sans.className}`}>
        <header className="top-0">
          <Navbar />
        </header>
        <main className="flex min-h-screen flex-col items-center">
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
