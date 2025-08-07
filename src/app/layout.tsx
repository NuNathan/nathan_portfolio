import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import TopNavigation from "@/components/navigation/TopNavigation";
import GlobalSpotlight from "@/components/spotlight/GlobalSpotlight";
import ErrorBoundary from "@/components/error/ErrorBoundary";
import AnalyticsErrorBoundary from "@/components/error/AnalyticsErrorBoundary";
import GlobalErrorHandler from "@/components/error/GlobalErrorHandler";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"
import { getOGImageUrl } from "@/api/strapi";


const openSans = Open_Sans({
  subsets: ['latin'],
  display: 'swap',
});

// Helper function for structured data
function getPersonStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Nathan Campbell",
    "jobTitle": "Computer Science Student",
    "description": "Passionate Computer Science student crafting innovative digital solutions with React, Vue, and modern web technologies.",
    "url": "https://nathan.binarybridges.ca",
    "sameAs": [
      "https://www.linkedin.com/in/nathan--campbell",
      "https://github.com/NuNathan"
    ],
    "knowsAbout": [
      "Software Engineering",
      "Computer Science",
      "Web Development",
      "React",
      "Vue.js",
      "JavaScript",
      "TypeScript",
      "Next.js",
      "Frontend Development",
      "Full Stack Development"
    ],
    "alumniOf": {
      "@type": "University Of Calgary",
      "name": "Computer Science Program"
    }
  };
}

export const metadata: Metadata = {
  metadataBase: new URL('https://nathan.binarybridges.ca'),
  title: {
    default: "Nathan Campbell - Computer Science Portfolio",
    template: "%s | Nathan Campbell"
  },
  description: "Nathan Campbell's personal portfolio showcasing computer science projects, technical skills, and professional experience. Passionate Computer Science student crafting innovative digital solutions with React, Vue, and modern web technologies.",
  keywords: [
    "Nathan Campbell",
    "Software Engineer",
    "Portfolio",
    "React Developer",
    "Vue Developer",
    "Web Development",
    "Computer Science Student",
    "Frontend Developer",
    "Full Stack Developer",
    "JavaScript",
    "TypeScript",
    "Next.js",
    "Personal Portfolio"
  ],
  authors: [{ name: "Nathan Campbell" }],
  creator: "Nathan Campbell",
  publisher: "Nathan Campbell",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://nathan.binarybridges.ca',
    siteName: 'Nathan Campbell Portfolio',
    title: 'Nathan Campbell - Computer Science Portfolio',
    description: 'Passionate Computer Science student crafting innovative digital solutions with React, Vue, and modern web technologies.',
    images: [
      {
        url: getOGImageUrl('og-image'),
        width: 1200,
        height: 630,
        alt: 'Nathan Campbell - Software Engineer Portfolio',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nathan Campbell - Computer Science Portfolio',
    description: 'Passionate Computer Science student crafting innovative digital solutions with React, Vue, and modern web technologies.',
    images: [getOGImageUrl('og-image')],
    creator: '@NRCsme',
  },
  verification: {
    google: 'your-google-verification-code',
  },
  alternates: {
    canonical: 'https://nathan.binarybridges.ca',
  },
  category: 'technology',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Security Headers - Note: X-Frame-Options removed as it should only be in HTTP headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />

        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(getPersonStructuredData()) }}
        />
      </head>
      <body className={openSans.className}>
        {/** Rybbit and Vercel analytics */}
        <AnalyticsErrorBoundary>
          <script
            src="https://app.rybbit.io/api/script.js"
            data-site-id="1975"
            defer
          ></script>
          <Analytics />
          <SpeedInsights />
        </AnalyticsErrorBoundary>


        {/** Global error handler */}
        <GlobalErrorHandler />

        {/** Main app content */}
        <ErrorBoundary>
          <AnalyticsErrorBoundary>
            <GlobalSpotlight />
          </AnalyticsErrorBoundary>
          <TopNavigation />
          <main className="">
            {children}
          </main>
        </ErrorBoundary>
      </body>
    </html>
  );
}
