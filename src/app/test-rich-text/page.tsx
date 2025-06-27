'use client';

import RichTextRenderer from '@/components/ui/RichTextRenderer';

// Sample CKEditor output that includes the exact content from your API
const sampleCKEditorContent = `<p>Content</p><p><img src="https://positive-life-875d223e2a.media.strapiapp.com/Headshot_28ebd93e66.JPG" alt="Headshot.JPG" srcset="https://positive-life-875d223e2a.media.strapiapp.com/thumbnail_Headshot_28ebd93e66.JPG 110w,https://positive-life-875d223e2a.media.strapiapp.com/small_Headshot_28ebd93e66.JPG 354w,https://positive-life-875d223e2a.media.strapiapp.com/medium_Headshot_28ebd93e66.JPG 532w,https://positive-life-875d223e2a.media.strapiapp.com/large_Headshot_28ebd93e66.JPG 709w," sizes="100vw" width="2268" height="3201"></p>`;

export default function TestRichTextPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Rich Text Renderer Test</h1>
            <p className="text-gray-600">
              This page demonstrates how the RichTextRenderer component handles various CKEditor output elements.
              The content below is rendered from HTML that would typically come from a CKEditor field in Strapi.
            </p>
          </div>
          
          <div className="border-t pt-8">
            <RichTextRenderer 
              content={sampleCKEditorContent}
              className="test-rich-content"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
