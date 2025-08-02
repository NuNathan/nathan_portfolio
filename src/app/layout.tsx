import type { Metadata } from "next";
import "./globals.css";
import TopNavigation from "@/components/navigation/TopNavigation";
import GlobalSpotlight from "@/components/spotlight/GlobalSpotlight";
import ErrorBoundary from "@/components/error/ErrorBoundary";

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
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap" rel="stylesheet"></link>
      </head>
      <body>
        <script
          src="https://app.rybbit.io/api/script.js"
          data-site-id="1975"
          defer
        ></script>
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
