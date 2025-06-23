import type { Metadata } from "next";
import "./globals.css";
import TopNavigation from "@/components/navigation/TopNavigation";

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
        <TopNavigation />
        <main className="">
          {children}
        </main>
      </body>
    </html>
  );
}
