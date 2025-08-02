'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import DOMPurify from 'dompurify';
import parse, { HTMLReactParserOptions, Element, domToReact, DOMNode } from 'html-react-parser';
import Link from 'next/link';

interface RichTextRendererProps {
  content: string;
  className?: string;
  preventNestedLinks?: boolean; // Flag to prevent nested anchor tags
}

/**
 * Comprehensive rich text renderer that handles all CKEditor output
 * Uses DOMPurify for security and html-react-parser for React integration
 * Supports: headings, paragraphs, lists, links, images, tables, code blocks,
 * blockquotes, emphasis, strong text, and more
 */
export default function RichTextRenderer({ content, className = '', preventNestedLinks = false }: RichTextRendererProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  // Preprocess HTML to fix common nesting issues
  const preprocessHTML = (htmlContent: string): string => {
    if (!htmlContent) return '';

    let processed = htmlContent;

    // 1. Clean up img tags - remove srcset and sizes attributes but keep the image
    processed = processed.replace(/<img([^>]*)\s+srcset="[^"]*"([^>]*)>/gi, '<img$1$2>');
    processed = processed.replace(/<img([^>]*)\s+sizes="[^"]*"([^>]*)>/gi, '<img$1$2>');

    // 2. Only remove img tags that have explicitly empty src attributes (src="" or src='')
    processed = processed.replace(/<img[^>]*src\s*=\s*["']\s*["'][^>]*>/gi, '');

    // 3. Fix block elements inside paragraphs by converting the paragraph to a div
    const blockElements = ['div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'blockquote', 'pre', 'table', 'figure', 'hr'];

    blockElements.forEach(tag => {
      // Convert paragraphs containing block elements to divs
      const regex = new RegExp(`<p([^>]*)>([^<]*)<${tag}([^>]*)>`, 'gi');
      processed = processed.replace(regex, `<div$1>$2<${tag}$3>`);

      const endRegex = new RegExp(`</${tag}>([^<]*)</p>`, 'gi');
      processed = processed.replace(endRegex, `</${tag}>$1</div>`);
    });

    // 4. Handle images inside paragraphs - convert paragraph to div to avoid invalid nesting
    processed = processed.replace(/<p([^>]*)>([^<]*)<img([^>]*)>([^<]*)<\/p>/gi, '<div$1>$2<img$3>$4</div>');

    return processed;
  };

  // Sanitize the HTML content consistently
  const sanitizeContent = (htmlContent: string): string => {
    const preprocessed = preprocessHTML(htmlContent);

    // Always use the same sanitization approach for SSR consistency
    if (!isClient) {
      return preprocessed;
    }

    // Configure DOMPurify to allow all CKEditor elements (client-side only)
    const config = {
      ALLOWED_TAGS: [
        'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'strike', 'del', 'mark', 'code', 'pre',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'ul', 'ol', 'li',
        'a', 'img', 'figure', 'figcaption',
        'blockquote', 'cite',
        'table', 'thead', 'tbody', 'tr', 'th', 'td', 'caption',
        'div', 'span', 'section', 'article', 'aside', 'header', 'footer', 'main', 'nav',
        'hr', 'sub', 'sup', 'abbr', 'kbd', 'samp', 'var', 'time', 'address',
        'details', 'summary', 'dl', 'dt', 'dd'
      ],
      ALLOWED_ATTR: [
        'href', 'target', 'rel', 'src', 'alt', 'width', 'height', 'title', 'class', 'id',
        'style', 'data-*', 'colspan', 'rowspan', 'datetime', 'dateTime', 'cite', 'lang', 'dir'
      ],
      ALLOW_DATA_ATTR: true,
      KEEP_CONTENT: true
    };

    return DOMPurify.sanitize(preprocessed, config);
  };

  // Helper function to check if an element is a block element
  const isBlockElement = (tagName: string): boolean => {
    const blockElements = [
      'div', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'blockquote', 'pre', 'table',
      'thead', 'tbody', 'tr', 'th', 'td', 'figure',
      'figcaption', 'hr', 'address', 'details', 'summary'
    ];
    return blockElements.includes(tagName);
  };

  // Parser options for html-react-parser
  const parserOptions: HTMLReactParserOptions = {
    replace: (domNode: DOMNode) => {
      if (domNode.type === 'tag') {
        const element = domNode as Element;
        const tagName = element.name;
        const attribs = element.attribs || {};
        const children = element.children ? domToReact(element.children as DOMNode[], parserOptions) : null;

        // Handle different HTML elements with proper React components
        switch (tagName) {
          // Headings
          case 'h1':
            return <h1 className="text-4xl font-bold text-gray-900 mb-6 mt-8 first:mt-0" {...attribs}>{children}</h1>;
          case 'h2':
            return <h2 className="text-3xl font-bold text-gray-900 mb-5 mt-7 first:mt-0" {...attribs}>{children}</h2>;
          case 'h3':
            return <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-6 first:mt-0" {...attribs}>{children}</h3>;
          case 'h4':
            return <h4 className="text-xl font-bold text-gray-900 mb-3 mt-5 first:mt-0" {...attribs}>{children}</h4>;
          case 'h5':
            return <h5 className="text-lg font-bold text-gray-900 mb-3 mt-4 first:mt-0" {...attribs}>{children}</h5>;
          case 'h6':
            return <h6 className="text-base font-bold text-gray-900 mb-2 mt-3 first:mt-0" {...attribs}>{children}</h6>;

          // Paragraphs - check for block elements in children to prevent invalid nesting
          case 'p':
            // If children contain block elements, render as div instead to avoid invalid HTML
            const hasBlockChildren = element.children?.some((child: any) =>
              child.type === 'tag' && isBlockElement(child.name)
            );

            if (hasBlockChildren) {
              return <div className="mb-4 text-gray-700 leading-relaxed" {...attribs}>{children}</div>;
            }
            return <p className="mb-4 text-gray-700 leading-relaxed" {...attribs}>{children}</p>;

          // Text formatting
          case 'strong':
          case 'b':
            return <strong className="font-semibold text-gray-900" {...attribs}>{children}</strong>;
          case 'em':
          case 'i':
            return <em className="italic" {...attribs}>{children}</em>;
          case 'u':
            return <u className="underline" {...attribs}>{children}</u>;
          case 's':
          case 'strike':
          case 'del':
            return <s className="line-through" {...attribs}>{children}</s>;
          case 'mark':
            return <mark className="bg-yellow-200 px-1 rounded" {...attribs}>{children}</mark>;
          case 'code':
            return <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800" {...attribs}>{children}</code>;

          // Lists
          case 'ul':
            return <ul className="list-disc list-inside mb-4 ml-4 space-y-1" {...attribs}>{children}</ul>;
          case 'ol':
            return <ol className="list-decimal list-inside mb-4 ml-4 space-y-1" {...attribs}>{children}</ol>;
          case 'li':
            return <li className="text-gray-700 leading-relaxed" {...attribs}>{children}</li>;

          // Links
          case 'a':
            const href = attribs.href || '#';
            const isExternal = href.startsWith('http') && !href.includes('localhost') && !href.includes('127.0.0.1');
            const isInternal = href.startsWith('/') || (!href.startsWith('http') && !href.startsWith('mailto:') && !href.startsWith('tel:'));
            const linkAttribs = { ...attribs };

            // If preventNestedLinks is true, render as span instead of link
            if (preventNestedLinks) {
              return (
                <span className="text-blue-600 underline cursor-pointer">
                  {children}
                </span>
              );
            }

            if (isExternal) {
              linkAttribs.target = '_blank';
              linkAttribs.rel = 'noopener noreferrer';
              return (
                <a
                  href={href}
                  className="text-blue-600 hover:text-blue-800 underline transition-colors duration-200"
                  {...linkAttribs}
                >
                  {children}
                </a>
              );
            } else if (isInternal) {
              return (
                <Link
                  href={href}
                  className="text-blue-600 hover:text-blue-800 underline transition-colors duration-200"
                  prefetch={true}
                >
                  {children}
                </Link>
              );
            } else {
              return (
                <a
                  href={href}
                  className="text-blue-600 hover:text-blue-800 underline transition-colors duration-200"
                  {...linkAttribs}
                >
                  {children}
                </a>
              );
            }

          // Images
          case 'img':
            const src = attribs.src || '';
            const alt = attribs.alt || '';
            let width = parseInt(attribs.width) || 800;
            let height = parseInt(attribs.height) || 600;

            // Only render if src is not empty and is a valid URL
            if (src && src.trim() !== '' && (src.startsWith('http') || src.startsWith('/') || src.startsWith('data:'))) {
              // Ensure reasonable dimensions for Next.js Image
              if (width > 1200) {
                const ratio = height / width;
                width = 1200;
                height = Math.round(width * ratio);
              }

              return (
                <div className="my-6">
                  <Image
                    src={src}
                    alt={alt}
                    width={width}
                    height={height}
                    className="rounded-lg shadow-sm max-w-full h-auto"
                    priority={false}
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                  />
                  {alt && (
                    <div className="text-sm text-gray-600 text-center mt-2 italic">{alt}</div>
                  )}
                </div>
              );
            }
            return null;

          // Blockquotes
          case 'blockquote':
            return (
              <blockquote className="border-l-4 border-blue-500 pl-4 py-2 my-6 bg-gray-50 italic text-gray-700" {...attribs}>
                {children}
              </blockquote>
            );

          // Code blocks
          case 'pre':
            return (
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-6 text-sm" {...attribs}>
                {children}
              </pre>
            );

          // Tables
          case 'table':
            return (
              <div className="overflow-x-auto my-6">
                <table className="min-w-full border-collapse border border-gray-300" {...attribs}>
                  {children}
                </table>
              </div>
            );
          case 'thead':
            return <thead className="bg-gray-50" {...attribs}>{children}</thead>;
          case 'tbody':
            return <tbody {...attribs}>{children}</tbody>;
          case 'tr':
            return <tr className="border-b border-gray-200" {...attribs}>{children}</tr>;
          case 'th':
            return <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-900" {...attribs}>{children}</th>;
          case 'td':
            return <td className="border border-gray-300 px-4 py-2 text-gray-700" {...attribs}>{children}</td>;

          // Horizontal rule
          case 'hr':
            return <hr className="my-8 border-gray-300" {...attribs} />;

          // Divs and spans
          case 'div':
            // Only add margin if this div contains block content
            const hasBlockContent = element.children?.some((child: any) =>
              child.type === 'tag' && isBlockElement(child.name)
            );
            const divClassName = hasBlockContent ? "mb-4" : "";
            return <div className={divClassName} {...attribs}>{children}</div>;
          case 'span':
            return <span {...attribs}>{children}</span>;

          // Line breaks
          case 'br':
            return <br {...attribs} />;

          // Figures and captions
          case 'figure':
            return <figure className="my-6" {...attribs}>{children}</figure>;
          case 'figcaption':
            return <figcaption className="text-sm text-gray-600 text-center mt-2 italic" {...attribs}>{children}</figcaption>;

          // Subscript and superscript
          case 'sub':
            return <sub {...attribs}>{children}</sub>;
          case 'sup':
            return <sup {...attribs}>{children}</sup>;

          // Abbreviations
          case 'abbr':
            return <abbr className="border-b border-dotted border-gray-400 cursor-help" {...attribs}>{children}</abbr>;

          // Citations
          case 'cite':
            return <cite className="italic text-gray-600" {...attribs}>{children}</cite>;

          // Keyboard input
          case 'kbd':
            return <kbd className="bg-gray-200 px-2 py-1 rounded text-sm font-mono border" {...attribs}>{children}</kbd>;

          // Sample output
          case 'samp':
            return <samp className="bg-gray-100 px-2 py-1 rounded text-sm font-mono" {...attribs}>{children}</samp>;

          // Variables
          case 'var':
            return <var className="italic font-mono text-gray-800" {...attribs}>{children}</var>;

          // Time
          case 'time':
            // Fix datetime attribute for React
            const timeAttribs = { ...attribs };
            if (timeAttribs.datetime) {
              timeAttribs.dateTime = timeAttribs.datetime;
              delete timeAttribs.datetime;
            }
            return <time {...timeAttribs}>{children}</time>;

          // Address
          case 'address':
            return <address className="italic not-italic mb-4" {...attribs}>{children}</address>;

          // Details and summary (collapsible content)
          case 'details':
            return <details className="mb-4 border border-gray-200 rounded p-4" {...attribs}>{children}</details>;
          case 'summary':
            return <summary className="font-semibold cursor-pointer hover:text-blue-600" {...attribs}>{children}</summary>;

          // Default case - don't replace, let html-react-parser handle it
          default:
            return undefined; // Let the parser handle it normally
        }
      }
      return undefined; // Let the parser handle non-element nodes
    }
  };

  // Main render function
  const sanitizedContent = sanitizeContent(content);

  return (
    <div className={`rich-text-content prose prose-lg max-w-none ${className}`}>
      {parse(sanitizedContent, parserOptions)}
    </div>
  );
}
