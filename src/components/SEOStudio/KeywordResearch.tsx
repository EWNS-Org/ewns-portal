'use client';

import React, { useState } from 'react';
import { Button, TextField, CircularProgress } from '@mui/material';
import { keywordResearch, competitorKeywords } from '@/services/api/seo.service';
import { ACTIVE_BUSINESS_ID } from '@/utils/constants';

export default function KeywordResearch() {
  const [mode, setMode] = useState<'topic' | 'competitor'>('topic');
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [keywords, setKeywords] = useState<any[]>([]);
  const [compKeywords, setCompKeywords] = useState<any[]>([]);

  const handleResearch = async () => {
    const businessId = localStorage.getItem(ACTIVE_BUSINESS_ID);
    if (!businessId || !topic.trim()) return;
    setLoading(true);
    setKeywords([]);
    try {
      const res = await keywordResearch(businessId, topic);
      if (res?.isSuccess) setKeywords(res.data);
    } finally {
      setLoading(false);
    }
  };

  const handleCompetitor = async () => {
    const businessId = localStorage.getItem(ACTIVE_BUSINESS_ID);
    if (!businessId) return;
    setLoading(true);
    setCompKeywords([]);
    try {
      const res = await competitorKeywords(businessId);
      if (res?.isSuccess) setCompKeywords(res.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="seo-card">
      <p className="seo-card__title">Keyword Research</p>
      <p className="seo-card__desc">
        Research keywords by topic or analyze competitor keywords in your niche.
      </p>

      <div className="seo-mode-toggle">
        <button className={`seo-mode-toggle__btn ${mode === 'topic' ? 'seo-mode-toggle__btn--active' : ''}`} onClick={() => setMode('topic')}>Topic Research</button>
        <button className={`seo-mode-toggle__btn ${mode === 'competitor' ? 'seo-mode-toggle__btn--active' : ''}`} onClick={() => setMode('competitor')}>Competitor Keywords</button>
      </div>

      {mode === 'topic' ? (
        <>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', marginTop: 16 }}>
            <TextField
              size="small"
              placeholder="e.g. dental implants, home renovation, wedding photography"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleResearch()}
              style={{ minWidth: 320 }}
            />
            <Button
              className="seo-generate-btn"
              onClick={handleResearch}
              disabled={loading || !topic.trim()}
              startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
            >
              {loading ? 'Researching…' : '🔍 Research Keywords'}
            </Button>
          </div>

          {keywords.length > 0 && (
            <div style={{ marginTop: 20, overflowX: 'auto' }}>
              <table className="seo-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Keyword</th>
                    <th>Intent</th>
                    <th>Difficulty</th>
                    <th>Why it matters</th>
                  </tr>
                </thead>
                <tbody>
                  {keywords.map((kw, i) => (
                    <tr key={i}>
                      <td style={{ color: '#94a3b8' }}>{i + 1}</td>
                      <td><strong>{kw.keyword}</strong></td>
                      <td><span className={`seo-tag seo-tag--${kw.intent}`}>{kw.intent}</span></td>
                      <td><span className={`seo-tag seo-tag--${kw.difficulty}`}>{kw.difficulty}</span></td>
                      <td style={{ color: '#64748b' }}>{kw.relevance}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {keywords.length === 0 && !loading && (
            <div className="seo-empty">Enter a topic and click Research Keywords to get AI-generated keyword suggestions.</div>
          )}
        </>
      ) : (
        <>
          <div style={{ marginTop: 16 }}>
            <p style={{ fontSize: 13, color: '#64748b', marginBottom: 12 }}>
              AI analyzes your business category and location to surface keywords that competitors in your niche are likely targeting.
            </p>
            <Button
              className="seo-generate-btn"
              onClick={handleCompetitor}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
            >
              {loading ? 'Analyzing…' : '🏆 Analyze Competitor Keywords'}
            </Button>
          </div>

          {compKeywords.length > 0 && (
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
                  {compKeywords.map((kw, i) => (
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

          {compKeywords.length === 0 && !loading && (
            <div className="seo-empty">Click the button to reveal keywords your competitors are likely targeting.</div>
          )}
        </>
      )}
    </div>
  );
}
