'use client';

import React from 'react';

const Dashboard: React.FC = () => {
    return (
        <div className="pg-root">
            <div className="pg-header">
                <h1 className="pg-title">Dashboard</h1>
                <p className="pg-subtitle">Welcome to your business dashboard</p>
            </div>
            <div className="pg-card">
                <div className="pg-empty">
                    <span className="pg-empty-icon">📊</span>
                    <span className="pg-empty-text">Dashboard coming soon</span>
                    <span className="pg-empty-sub">Analytics and insights will appear here</span>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
