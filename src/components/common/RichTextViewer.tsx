import React from 'react';
// Optionally install DOMPurify for sanitization: npm install dompurify
import DOMPurify from 'dompurify';

const RichTextViewer = ({ content, className = '' }: any) => {
  // Use DOMPurify to sanitize the content if it's user-generated or external
  const sanitizedContent = DOMPurify.sanitize(content);

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      style={{ padding: '20px', fontSize: '1rem', color: '#333' }}
    />
  );
};

export default RichTextViewer;
