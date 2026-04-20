'use client';

import React, { useState } from 'react';
import { Button, CircularProgress, LinearProgress } from '@mui/material';
import { bulkGenerateMeta } from '@/services/api/seo.service';
import { ACTIVE_BUSINESS_ID } from '@/utils/constants';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export default function BulkGenerator() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const handleBulkGenerate = async () => {
    const businessId = localStorage.getItem(ACTIVE_BUSINESS_ID);
    if (!businessId) return;
    setLoading(true);
    setResults([]);
    try {
      const res = await bulkGenerateMeta(businessId);
      if (res?.isSuccess) setResults(res.data);
    } finally {
      setLoading(false);
    }
  };

  const successCount = results.filter((r) => r.success).length;
  const failCount = results.filter((r) => !r.success).length;

  return (
    <div className="seo-card">
      <p className="seo-card__title">Bulk Meta Generation</p>
      <p className="seo-card__desc">
        Generate and save AI-optimized meta tags for all your website pages (Home, About, Services, Blogs, Contact, Teams, Albums) in one click. Tags are saved directly — your live website updates immediately.
      </p>

      <Button
        className="seo-generate-btn"
        onClick={handleBulkGenerate}
        disabled={loading}
        startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
      >
        {loading ? 'Generating for all pages…' : '⚡ Bulk Generate All Pages'}
      </Button>

      {loading && (
        <div style={{ marginTop: 20 }}>
          <p style={{ fontSize: 13, color: '#64748b', marginBottom: 8 }}>AI is generating meta tags for each page…</p>
          <LinearProgress />
        </div>
      )}

      {results.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <p style={{ fontSize: 13, color: '#64748b', marginBottom: 12 }}>
            <strong style={{ color: '#22c55e' }}>{successCount} pages</strong> updated successfully
            {failCount > 0 && <>, <strong style={{ color: '#ef4444' }}>{failCount} failed</strong></>}.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {results.map((r, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 14px', background: r.success ? '#f0fdf4' : '#fef2f2', borderRadius: 8, border: `1px solid ${r.success ? '#bbf7d0' : '#fecaca'}` }}>
                {r.success
                  ? <CheckCircleOutlineIcon fontSize="small" style={{ color: '#22c55e', marginTop: 2 }} />
                  : <ErrorOutlineIcon fontSize="small" style={{ color: '#ef4444', marginTop: 2 }} />
                }
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13, textTransform: 'capitalize' }}>{r.page}</div>
                  {r.success && <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{r.meta?.title}</div>}
                  {!r.success && <div style={{ fontSize: 12, color: '#ef4444', marginTop: 2 }}>{r.error}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {results.length === 0 && !loading && (
        <div className="seo-empty">Click the button above to generate meta tags for all pages at once.</div>
      )}
    </div>
  );
}
