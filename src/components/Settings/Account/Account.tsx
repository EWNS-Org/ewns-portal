'use client';

import React from 'react'

function Account() {
    return (
        <div className="pg-root">
            <div className="pg-header">
                <h1 className="pg-title">Account Settings</h1>
                <p className="pg-subtitle">Manage your account preferences and security</p>
            </div>
            <div className="pg-card">
                <div className="pg-empty">
                    <span className="pg-empty-icon">⚙️</span>
                    <span className="pg-empty-text">Account settings coming soon</span>
                    <span className="pg-empty-sub">Configure your account preferences here</span>
                </div>
            </div>
        </div>
    )
}

export default Account