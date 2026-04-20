'use client';

import React, { useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import { auditSEO } from '@/services/api/seo.service';
import { ACTIVE_BUSINESS_ID } from '@/utils/constants';

function ScoreBadge({ score }: { score: number }) {
  const cls = score >= 70 ? 'high' : score >= 40 ? 'medium' : 'low';
  return <span className={`seo-score-badge seo-score-badge--${cls}`}>{score}</span>;
}

export default function SEOAudit() {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<any[]>([]);

  const handleAudit = async () => {
    const businessId = localStorage.getItem(ACTIVE_BUSINESS_ID);
    if (!businessId) return;
    setLoading(true);
    setReport([]);
    try {
      const res = await auditSEO(businessId);
      if (res?.isSuccess) setReport(res.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="seo-card">
      <p className="seo-card__title">SEO Audit</p>
      <p className="seo-card__desc">
        AI analyzes your existing meta tags and scores each page from 0-100. Get actionable issues and suggestions to fix them.
      </p>

      <Button
        className="seo-generate-btn"
        onClick={handleAudit}
        disabled={loading}
        startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
      >
        {loading ? 'Auditing…' : '📊 Run SEO Audit'}
      </Button>

      {report.length > 0 && (
        <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {report.map((item, i) => (
            <div key={i} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <ScoreBadge score={item.score} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, textTransform: 'capitalize' }}>{item.page}</div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>SEO Score: {item.score}/100</div>
                </div>
              </div>

              {item.issues?.length > 0 && (
                <div style={{ marginBottom: 8 }}>
                  <div className="seo-result-label" style={{ marginBottom: 6 }}>Issues</div>
                  <ul style={{ margin: 0, paddingLeft: 18 }}>
                    {item.issues.map((issue: string, j: number) => (
                      <li key={j} style={{ fontSize: 13, color: '#ef4444', marginBottom: 3 }}>{issue}</li>
                    ))}
                  </ul>
                </div>
              )}

              {item.suggestions?.length > 0 && (
                <div>
                  <div className="seo-result-label" style={{ marginBottom: 6 }}>Suggestions</div>
                  <ul style={{ margin: 0, paddingLeft: 18 }}>
                    {item.suggestions.map((s: string, j: number) => (
                      <li key={j} style={{ fontSize: 13, color: '#22c55e', marginBottom: 3 }}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {report.length === 0 && !loading && (
        <div className="seo-empty">Click Run Audit to get an AI-powered SEO analysis of all your pages.</div>
      )}
    </div>
  );
}
