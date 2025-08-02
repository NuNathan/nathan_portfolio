import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import TopNavigation from "@/components/navigation/TopNavigation";
import GlobalSpotlight from "@/components/spotlight/GlobalSpotlight";
import ErrorBoundary from "@/components/error/ErrorBoundary";

const openSans = Open_Sans({
  subsets: ['latin'],
  display: 'swap',
});
import { Analytics } from "@vercel/analytics/next"

export const metadata: Metadata = {
  title: "Nathan's Portfolio",
  description: "Nathan's Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={openSans.className}>
        {/** Rybbit and Vercel analytics */}
        <script
          src="https://app.rybbit.io/api/script.js"
          data-site-id="1975"
          defer
        ></script>
        <Analytics />

        {/** Main app content */}
        <ErrorBoundary>
          <GlobalSpotlight />
          <TopNavigation />
          <main className="">
            {children}
          </main>
        </ErrorBoundary>
      </body>
    </html>
  );
}
