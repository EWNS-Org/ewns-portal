'use client';

import React, { useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import { blogSEOSuggestions } from '@/services/api/seo.service';
import { ACTIVE_BUSINESS_ID } from '@/utils/constants';

export default function BlogSuggestions() {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  const handleFetch = async () => {
    const businessId = localStorage.getItem(ACTIVE_BUSINESS_ID);
    if (!businessId) return;
    setLoading(true);
    setSuggestions([]);
    try {
      const res = await blogSEOSuggestions(businessId);
      if (res?.isSuccess) setSuggestions(res.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="seo-card">
      <p className="seo-card__title">Blog SEO Ideas</p>
      <p className="seo-card__desc">
        AI identifies SEO content gaps based on your existing blogs and generates 5 new blog ideas with target keywords, search intent, and a content outline.
      </p>

      <Button
        className="seo-generate-btn"
        onClick={handleFetch}
        disabled={loading}
        startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
      >
        {loading ? 'Generating Ideas…' : '✍️ Generate Blog Ideas'}
      </Button>

      {suggestions.length > 0 && (
        <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {suggestions.map((s, i) => (
            <div key={i} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ background: '#6c47ff', color: '#fff', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
                <strong style={{ fontSize: 14 }}>{s.title}</strong>
              </div>

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
                <span className="seo-keyword-chip">🎯 {s.targetKeyword}</span>
                <span className={`seo-tag seo-tag--${s.searchIntent}`}>{s.searchIntent}</span>
              </div>

              {s.outline?.length > 0 && (
                <div>
                  <div className="seo-result-label" style={{ marginBottom: 6 }}>Content Outline</div>
                  <ol style={{ margin: 0, paddingLeft: 18 }}>
                    {s.outline.map((section: string, j: number) => (
                      <li key={j} style={{ fontSize: 13, color: '#475569', marginBottom: 3 }}>{section}</li>
                    ))}
                  </ol>
                </div>
              )}

              {s.whyItWorks && (
                <div style={{ marginTop: 10, fontSize: 12, color: '#64748b', fontStyle: 'italic' }}>
                  💡 {s.whyItWorks}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {suggestions.length === 0 && !loading && (
        <div className="seo-empty">Click the button to get AI-generated blog ideas tailored to your business's SEO gaps.</div>
      )}
    </div>
  );
}
