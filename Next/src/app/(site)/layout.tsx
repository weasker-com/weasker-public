import Navbar from "@/components/Navbar";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Footer from "@/components/Footer";
import PlausibleProvider from "next-plausible";
import { AuthProvider } from "../../providers/Auth/Auth";
import NextTopLoader from "nextjs-toploader";
import React from "react";
import Scroll from "../../../patches/FixScollBug";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const ogImage = `${process.env.SITE_URL}/api/og/hp`;
const metaTitle = `${process.env.SITE_NAME} - Ask The Right Community`;
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
    <html lang="en" className="">
      <head>
        <PlausibleProvider
          domain={process.env.SITE_NAKED_URL}
          // trackLocalhost={true}
          // enabled={true}
          taggedEvents={true}
        />
      </head>
      <Scroll />
      <body className={`bg-white ${inter.className}`}>
        <NextTopLoader showSpinner={false} color="#007BFF" shadow={false} />
        <header className="top-0 max-w-[90%] mx-auto">
          <AuthProvider>
            <Navbar />
          </AuthProvider>
        </header>
        <main className="flex min-h-screen flex-col items-center max-w-[90%] my-5 md:my-10 mx-auto">
          {children}
        </main>
        <footer>
          <Footer />
        </footer>
      </body>
    </html>
  );
}
