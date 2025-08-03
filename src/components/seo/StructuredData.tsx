import React from 'react';

interface StructuredDataProps {
  type: 'person' | 'website' | 'article' | 'portfolio';
  data: any;
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  const generateStructuredData = () => {
    const baseData = {
      "@context": "https://schema.org",
    };

    switch (type) {
      case 'person':
        return {
          ...baseData,
          "@type": "Person",
          "name": "Nathan Campbell",
          "jobTitle": "Computer Science Student",
          "description": "Passionate Computer Science student crafting innovative digital solutions with React, Vue, and modern web technologies.",
          "url": "https://nathan.binarybridges.ca",
          "sameAs": [
            data.linkedIn || "https://linkedin.com/in/nathancampbell",
            data.github || "https://github.com/nathancampbell"
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
          },
          "email": data.email,
          "image": data.image || "https://positive-life-875d223e2a.media.strapiapp.com/Headshot_28ebd93e66.JPG"
        };

      case 'website':
        return {
          ...baseData,
          "@type": "WebSite",
          "name": "Nathan Campbell Portfolio",
          "description": "Nathan Campbell's personal portfolio showcasing Computer Science projects, technical skills, and professional experience.",
          "url": "https://nathan.binarybridges.ca",
          "author": {
            "@type": "Person",
            "name": "Nathan Campbell"
          },
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://nathan.binarybridges.ca/main/blog?search={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        };

      case 'article':
        return {
          ...baseData,
          "@type": "Article",
          "headline": data.title,
          "description": data.description,
          "author": {
            "@type": "Person",
            "name": "Nathan Campbell",
            "url": "https://nathan.binarybridges.ca"
          },
          "publisher": {
            "@type": "Person",
            "name": "Nathan Campbell",
            "url": "https://nathan.binarybridges.ca"
          },
          "datePublished": data.publishedDate,
          "dateModified": data.modifiedDate || data.publishedDate,
          "image": data.image,
          "url": data.url,
          "keywords": data.tags?.join(', '),
          "articleSection": "Technology",
          "wordCount": data.wordCount
        };

      case 'portfolio':
        return {
          ...baseData,
          "@type": "CreativeWork",
          "name": data.title,
          "description": data.description,
          "creator": {
            "@type": "Person",
            "name": "Nathan Campbell",
            "url": "https://nathan.binarybridges.ca"
          },
          "dateCreated": data.completionDate,
          "image": data.image,
          "url": data.url,
          "keywords": data.tags?.join(', '),
          "genre": "Software Development",
          "programmingLanguage": data.technologies
        };

      default:
        return baseData;
    }
  };

  const structuredData = generateStructuredData();

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2)
      }}
    />
  );
}
