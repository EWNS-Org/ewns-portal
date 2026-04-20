'use client';

import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import ScreenSearchDesktopOutlinedIcon from '@mui/icons-material/ScreenSearchDesktopOutlined';
import TitleOutlinedIcon from '@mui/icons-material/TitleOutlined';
import ManageSearchOutlinedIcon from '@mui/icons-material/ManageSearchOutlined';
import SEOAudit from './SEOAudit';
import MetaGenerator from './MetaGenerator';
import KeywordResearch from './KeywordResearch';
import { getAiCreditsBalance } from '@/services/api/subscription.service';
import { ACTIVE_BUSINESS_ID } from '@/utils/constants';
import Link from 'next/link';
import './SEOStudio.css';

const tabs = [
  { label: 'SEO Audit', icon: <ScreenSearchDesktopOutlinedIcon style={{ fontSize: 18 }} />, credits: '100 credits' },
  { label: 'Meta Generation', icon: <TitleOutlinedIcon style={{ fontSize: 18 }} />, credits: '20 / 150 credits' },
  { label: 'Keyword Research', icon: <ManageSearchOutlinedIcon style={{ fontSize: 18 }} />, credits: '20 credits' },
];

export default function SEOStudio() {
  const [activeTab, setActiveTab] = useState(0);
  const [creditsBalance, setCreditsBalance] = useState<any>(null);

  useEffect(() => {
    const businessId = typeof window !== 'undefined' ? localStorage.getItem(ACTIVE_BUSINESS_ID) : null;
    if (businessId) {
      getAiCreditsBalance(businessId).then(setCreditsBalance);
    }
  }, []);

  const totalCredits = (creditsBalance?.planCredits ?? 0) + (creditsBalance?.addonCredits ?? 0);
  const isLow = totalCredits > 0 && totalCredits < 500;
  const isEmpty = totalCredits === 0;

  return (
    <div className="seo-studio">
      <div className="seo-studio__header">
        <div className="seo-studio__title-row">
          <AutoAwesomeOutlinedIcon className="seo-studio__icon" />
          <h1 className="seo-studio__title">AI SEO Studio</h1>
          {creditsBalance !== null && (
            <Link href="/subscription" style={{ textDecoration: 'none', marginLeft: 'auto' }}>
              <span className={`seo-credits-badge ${isEmpty ? 'seo-credits-badge--empty' : isLow ? 'seo-credits-badge--low' : 'seo-credits-badge--ok'}`}>
                ⚡ {totalCredits.toLocaleString()} credits
              </span>
            </Link>
          )}
        </div>
        <p className="seo-studio__subtitle">
          Generate, audit, and optimize your website's SEO using AI — results instantly reflect on your live website.
        </p>
        {isEmpty && (
          <div className="seo-credits-warn">
            ⚠️ You have no AI credits left.{' '}
            <Link href="/subscription?tab=credits" style={{ color: '#7c3aed', fontWeight: 600 }}>
              Buy addon credits →
            </Link>
          </div>
        )}
      </div>

      <div className="seo-studio__tabs-bar">
        {tabs.map((tab, i) => (
          <button
            key={i}
            className={`seo-studio__tab-btn ${activeTab === i ? 'seo-studio__tab-btn--active' : ''}`}
            onClick={() => setActiveTab(i)}
          >
            <span className="seo-studio__tab-icon">{tab.icon}</span>
            <span className="seo-studio__tab-label">{tab.label}</span>
            <span className="seo-studio__tab-credits">{tab.credits}</span>
          </button>
        ))}
      </div>

      <div className="seo-studio__content">
        {activeTab === 0 && <SEOAudit />}
        {activeTab === 1 && <MetaGenerator />}
        {activeTab === 2 && <KeywordResearch />}
      </div>
    </div>
  );
}
