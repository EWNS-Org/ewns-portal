'use client';

import React, { useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import { competitorKeywords } from '@/services/api/seo.service';
import { ACTIVE_BUSINESS_ID } from '@/utils/constants';

export default function CompetitorKeywords() {
  const [loading, setLoading] = useState(false);
  const [keywords, setKeywords] = useState<any[]>([]);

  const handleFetch = async () => {
    const businessId = localStorage.getItem(ACTIVE_BUSINESS_ID);
    if (!businessId) return;
    setLoading(true);
    setKeywords([]);
    try {
      const res = await competitorKeywords(businessId);
      if (res?.isSuccess) setKeywords(res.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="seo-card">
      <p className="seo-card__title">Competitor Keywords</p>
      <p className="seo-card__desc">
        AI analyzes your business category and location to surface keywords that competitors in your niche are likely targeting. Use these to fill gaps in your SEO strategy.
      </p>

      <Button
        className="seo-generate-btn"
        onClick={handleFetch}
        disabled={loading}
        startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
      >
        {loading ? 'Analyzing…' : '🏆 Analyze Competitor Keywords'}
      </Button>

      {keywords.length > 0 && (
        <div style={{ marginTop: 20, overflowX: 'auto' }}>
          <table className="seo-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Keyword</th>
                <th>Intent</th>
                <th>Strategic Reasoning</th>
              </tr>
            </thead>
            <tbody>
              {keywords.map((kw, i) => (
                <tr key={i}>
                  <td style={{ color: '#94a3b8' }}>{i + 1}</td>
                  <td><strong>{kw.keyword}</strong></td>
                  <td><span className={`seo-tag seo-tag--${kw.intent}`}>{kw.intent}</span></td>
                  <td style={{ color: '#64748b' }}>{kw.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {keywords.length === 0 && !loading && (
        <div className="seo-empty">Click the button to reveal keywords your competitors are likely targeting.</div>
      )}
    </div>
  );
}
