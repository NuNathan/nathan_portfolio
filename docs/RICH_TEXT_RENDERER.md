# Rich Text Renderer Documentation

## Overview

The `RichTextRenderer` component is a comprehensive React component designed to safely render HTML content from CKEditor fields in Strapi. It handles all standard CKEditor output elements with proper styling and security measures.

## Features

### Security
- **DOMPurify Integration**: All HTML content is sanitized before rendering to prevent XSS attacks
- **Allowlist Approach**: Only approved HTML elements and attributes are allowed
- **Safe External Links**: External links automatically get `target="_blank"` and `rel="noopener noreferrer"`

### Supported CKEditor Elements

#### Text Formatting
- **Headings**: H1-H6 with proper hierarchy and spacing
- **Paragraphs**: Standard paragraph formatting with proper line spacing
- **Bold/Strong**: `<strong>` and `<b>` elements
- **Italic/Emphasis**: `<em>` and `<i>` elements
- **Underline**: `<u>` elements
- **Strikethrough**: `<s>`, `<strike>`, and `<del>` elements
- **Highlight**: `<mark>` elements with yellow background
- **Inline Code**: `<code>` elements with monospace font and background

#### Lists
- **Unordered Lists**: `<ul>` with bullet points
- **Ordered Lists**: `<ol>` with numbers
- **List Items**: `<li>` with proper spacing and nesting support

#### Links and Media
- **Links**: `<a>` elements with hover effects and external link handling
- **Images**: `<img>` elements rendered with Next.js Image component for optimization
- **Figures**: `<figure>` and `<figcaption>` for image captions

#### Code and Technical Content
- **Code Blocks**: `<pre>` elements with syntax highlighting background
- **Keyboard Input**: `<kbd>` elements styled as keyboard keys
- **Sample Output**: `<samp>` elements for code output
- **Variables**: `<var>` elements for programming variables

#### Structural Elements
- **Blockquotes**: `<blockquote>` with left border and italic styling
- **Horizontal Rules**: `<hr>` elements for section breaks
- **Divisions**: `<div>` and `<span>` elements for layout
- **Line Breaks**: `<br>` elements

#### Tables
- **Tables**: `<table>` with responsive wrapper
- **Table Headers**: `<thead>`, `<th>` with bold styling
- **Table Body**: `<tbody>`, `<tr>`, `<td>` with borders
- **Table Caption**: `<caption>` support

#### Advanced Elements
- **Subscript/Superscript**: `<sub>` and `<sup>` for mathematical expressions
- **Abbreviations**: `<abbr>` with dotted underline and tooltip
- **Citations**: `<cite>` with italic styling
- **Time**: `<time>` elements for dates and times
- **Address**: `<address>` for contact information
- **Details/Summary**: `<details>` and `<summary>` for collapsible content

## Usage

### Basic Usage

```tsx
import RichTextRenderer from '@/components/ui/RichTextRenderer';

function BlogPost({ content }: { content: string }) {
  return (
    <article>
      <RichTextRenderer 
        content={content}
        className="blog-content"
      />
    </article>
  );
}
```

### With PostData Interface

```tsx
import { PostData } from '@/api/posts';
import RichTextRenderer from '@/components/ui/RichTextRenderer';

function BlogDetailPage({ post }: { post: PostData }) {
  return (
    <div>
      <h1>{post.title}</h1>
      <RichTextRenderer 
        content={post.content || ''}
        className="article-body"
      />
    </div>
  );
}
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `content` | `string` | Yes | - | HTML content from CKEditor |
| `className` | `string` | No | `''` | Additional CSS classes |

## Styling

The component includes comprehensive Tailwind CSS classes for all elements:

- **Typography**: Proper font sizes, weights, and spacing
- **Colors**: Consistent color scheme with gray-based palette
- **Spacing**: Logical margins and padding for readability
- **Responsive**: Mobile-friendly sizing and spacing
- **Interactive**: Hover effects for links and interactive elements

## Security Configuration

The component uses DOMPurify with a carefully configured allowlist:

```javascript
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
    'style', 'data-*', 'colspan', 'rowspan', 'datetime', 'cite', 'lang', 'dir'
  ],
  ALLOW_DATA_ATTR: true,
  KEEP_CONTENT: true
};
```

## Server-Side Rendering

The component handles SSR gracefully:
- Falls back to basic HTML rendering on the server
- Full functionality available on the client
- No hydration mismatches

## Performance

- **Lazy Loading**: Images use Next.js Image component for optimization
- **Efficient Parsing**: html-react-parser provides efficient DOM-to-React conversion
- **Minimal Bundle**: Only includes necessary dependencies

## Testing

A test page is available at `/test-rich-text` that demonstrates all supported elements and their rendering.

## Integration with Strapi

The component is designed to work seamlessly with Strapi CKEditor fields:

1. **API Configuration**: Ensure your Strapi API includes the `content` field in responses
2. **PostData Interface**: The `content` field is included in the PostData interface
3. **Automatic Handling**: The BlogDetailClient component automatically uses RichTextRenderer

## Migration from Old System

If migrating from the old text-based content system:

1. **Update PostData**: Add `content?: string` field
2. **Update API calls**: Ensure `populate=*` includes content field
3. **Replace rendering**: Use RichTextRenderer instead of manual text processing
4. **Test thoroughly**: Verify all content renders correctly

## Troubleshooting

### Common Issues

1. **Content not rendering**: Check that the `content` field is populated in your API response
2. **Styling issues**: Ensure Tailwind CSS classes are available
3. **Images not loading**: Verify image URLs are absolute or properly configured
4. **Security warnings**: Check DOMPurify configuration if custom elements are needed

### Debug Mode

For debugging, you can inspect the sanitized HTML:

```tsx
const sanitizedContent = DOMPurify.sanitize(content, config);
console.log('Sanitized content:', sanitizedContent);
```
