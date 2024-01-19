import Navbar from "@/components/Navbar";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Noto_Sans } from "next/font/google";
import Footer from "@/components/Footer";

import { defaultImages } from "@/utils/defaultImages";
import PlausibleProvider from "next-plausible";

const inter = Inter({ subsets: ["latin"] });
const noto_Sans = Noto_Sans({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const ogImage = `/api/og?img=${defaultImages.weaskerLogoUrl}&preTitle=Interviewing experts&title=weasker.com`;

const metaTitle = `${process.env.SITE_NAME} - Interviewing Experts`;
const metaDescription =
  "We interview groups of experts and compare their answers, generating diverse and reliable information sources.";

export const metadata: Metadata = {
  applicationName: process.env.SITE_NAME,
  authors: { name: process.env.SITE_NAME, url: process.env.SITE_URL },
  title: metaTitle,
  description: metaDescription,
  openGraph: {
    images: [ogImage],
    type: "website",
    url: process.env.SITE_URL,
    title: metaTitle,
    description: metaDescription,
    siteName: process.env.SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: metaTitle,
    description: metaDescription,
    siteId: "1743914690978164736",
    creator: process.env.SITE_NAME,
    creatorId: "1743914690978164736",
    images: [ogImage],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-pt-[30px] sm:scroll-pt-[60px]">
      <head>
        <PlausibleProvider
          domain={process.env.NAKED_SITE_URL}
          // trackLocalhost={true}
          // enabled={true}
          taggedEvents={true}
        />
      </head>
      <body className={`bg-[#F4F4F4] ${noto_Sans.className}`}>
        <header className="top-0">
          <Navbar />
        </header>
        <main className="flex min-h-screen flex-col items-center">
          {children}
        </main>
        <footer>
          <Footer />
        </footer>
      </body>
    </html>
  );
}
