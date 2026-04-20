'use client';

import React, { useState } from 'react';
import { Button, MenuItem, Select, CircularProgress, Chip, LinearProgress } from '@mui/material';
import { generateMetaForPage, bulkGenerateMeta } from '@/services/api/seo.service';
import { ACTIVE_BUSINESS_ID } from '@/utils/constants';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import toast from 'react-hot-toast';

const PAGE_TYPES = [
  { label: 'Home', value: 'home' },
  { label: 'About', value: 'about' },
  { label: 'Services', value: 'services' },
  { label: 'Blogs', value: 'blogs' },
  { label: 'Contact', value: 'contact' },
  { label: 'Teams', value: 'teams' },
  { label: 'Albums', value: 'albums' },
];

export default function MetaGenerator() {
  const [mode, setMode] = useState<'single' | 'bulk'>('single');
  const [pageType, setPageType] = useState('home');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [bulkResults, setBulkResults] = useState<any[]>([]);

  const handleGenerate = async () => {
    const businessId = localStorage.getItem(ACTIVE_BUSINESS_ID);
    if (!businessId) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await generateMetaForPage(businessId, pageType);
      if (res?.isSuccess) setResult(res.data);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkGenerate = async () => {
    const businessId = localStorage.getItem(ACTIVE_BUSINESS_ID);
    if (!businessId) return;
    setLoading(true);
    setBulkResults([]);
    try {
      const res = await bulkGenerateMeta(businessId);
      if (res?.isSuccess) setBulkResults(res.data);
    } finally {
      setLoading(false);
    }
  };

  const successCount = bulkResults.filter((r) => r.success).length;
  const failCount = bulkResults.filter((r) => !r.success).length;

  return (
    <div className="seo-card">
      <p className="seo-card__title">Meta Generation</p>
      <p className="seo-card__desc">
        Generate AI-optimized meta tags for individual pages or all pages at once.
      </p>

      <div className="seo-mode-toggle">
        <button className={`seo-mode-toggle__btn ${mode === 'single' ? 'seo-mode-toggle__btn--active' : ''}`} onClick={() => setMode('single')}>Single Page</button>
        <button className={`seo-mode-toggle__btn ${mode === 'bulk' ? 'seo-mode-toggle__btn--active' : ''}`} onClick={() => setMode('bulk')}>Bulk Generate</button>
      </div>

      {mode === 'single' ? (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginTop: 16 }}>
            <Select
              size="small"
              value={pageType}
              onChange={(e) => setPageType(e.target.value)}
              style={{ minWidth: 160 }}
            >
              {PAGE_TYPES.map((p) => (
                <MenuItem key={p.value} value={p.value}>{p.label}</MenuItem>
              ))}
            </Select>

            <Button
              className="seo-generate-btn"
              onClick={handleGenerate}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
            >
              {loading ? 'Generating…' : 'Generate with AI'}
            </Button>
          </div>

          {result && (
            <div className="seo-result-box">
              <div className="seo-result-label">Title</div>
              <div className="seo-result-value">{result.title}</div>

              <div className="seo-result-label">Meta Description</div>
              <div className="seo-result-value">{result.description}</div>

              <div className="seo-result-label">OG Title</div>
              <div className="seo-result-value">{result.ogTitle}</div>

              <div className="seo-result-label">OG Description</div>
              <div className="seo-result-value">{result.ogDescription}</div>

              <div className="seo-result-label">Keywords</div>
              <div>
                {result.keywords?.map((k: string, i: number) => (
                  <span key={i} className="seo-keyword-chip">{k}</span>
                ))}
              </div>
            </div>
          )}

          {!result && !loading && (
            <div className="seo-empty">Select a page and click Generate to get AI-powered meta tags.</div>
          )}
        </>
      ) : (
        <>
          <div style={{ marginTop: 16 }}>
            <p style={{ fontSize: 13, color: '#64748b', marginBottom: 12 }}>
              Generate and save meta tags for all pages (Home, About, Services, Blogs, Contact, Teams, Albums) in one click.
            </p>
            <Button
              className="seo-generate-btn"
              onClick={handleBulkGenerate}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
            >
              {loading ? 'Generating for all pages…' : '⚡ Bulk Generate All Pages'}
            </Button>
          </div>

          {loading && (
            <div style={{ marginTop: 20 }}>
              <p style={{ fontSize: 13, color: '#64748b', marginBottom: 8 }}>AI is generating meta tags for each page…</p>
              <LinearProgress />
            </div>
          )}

          {bulkResults.length > 0 && (
            <div style={{ marginTop: 20 }}>
              <p style={{ fontSize: 13, color: '#64748b', marginBottom: 12 }}>
                <strong style={{ color: '#22c55e' }}>{successCount} pages</strong> updated successfully
                {failCount > 0 && <>, <strong style={{ color: '#ef4444' }}>{failCount} failed</strong></>}.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {bulkResults.map((r, i) => (
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

          {bulkResults.length === 0 && !loading && (
            <div className="seo-empty">Click the button above to generate meta tags for all pages at once.</div>
          )}
        </>
      )}
    </div>
  );
}
