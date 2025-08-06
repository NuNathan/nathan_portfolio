import Head from 'next/head';
import StructuredData from './StructuredData';
import { getOGImageUrl } from '@/api/strapi';

interface SEOHeadProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'profile';
  keywords?: string[];
  structuredData?: {
    type: 'person' | 'website' | 'article' | 'portfolio';
    data: any;
  };
  noIndex?: boolean;
}

export default function SEOHead({
  title,
  description,
  canonical,
  ogImage = getOGImageUrl('og-image'),
  ogType = 'website',
  keywords = [],
  structuredData,
  noIndex = false
}: SEOHeadProps) {
  const fullTitle = title.includes('Nathan Campbell') ? title : `${title} | Nathan Campbell`;
  const baseUrl = 'https://nathan.binarybridges.ca';
  const fullCanonical = canonical ? `${baseUrl}${canonical}` : baseUrl;
  const fullOgImage = ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`;

  return (
    <>
      <Head>
        {/* Basic Meta Tags */}
        <title>{fullTitle}</title>
        <meta name="description" content={description} />
        {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
        
        {/* Canonical URL */}
        <link rel="canonical" href={fullCanonical} />
        
        {/* Robots */}
        {noIndex ? (
          <meta name="robots" content="noindex, nofollow" />
        ) : (
          <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        )}
        
        {/* Open Graph */}
        <meta property="og:type" content={ogType} />
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={fullCanonical} />
        <meta property="og:image" content={fullOgImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="Nathan Campbell Portfolio" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={fullTitle} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={fullOgImage} />
        <meta name="twitter:creator" content="@NRCsme" />
        
        {/* Additional Meta Tags */}
        <meta name="author" content="Nathan Campbell" />
        <meta name="creator" content="Nathan Campbell" />
        <meta name="publisher" content="Nathan Campbell" />
        <meta name="theme-color" content="#2b61eb" />
        <meta name="msapplication-TileColor" content="#2b61eb" />
        
        {/* Preconnect for Performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://app.rybbit.io" />
        
        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="dns-prefetch" href="//app.rybbit.io" />
      </Head>
      
      {/* Structured Data */}
      {structuredData && (
        <StructuredData type={structuredData.type} data={structuredData.data} />
      )}
    </>
  );
}
