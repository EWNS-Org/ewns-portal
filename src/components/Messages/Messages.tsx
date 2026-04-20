'use client';

import React from 'react'

function Messages() {
    return (
        <div className="pg-root">
            <div className="pg-header">
                <h1 className="pg-title">Messages</h1>
                <p className="pg-subtitle">View and respond to customer messages</p>
            </div>
            <div className="pg-card">
                <div className="pg-empty">
                    <span className="pg-empty-icon">💬</span>
                    <span className="pg-empty-text">No messages yet</span>
                    <span className="pg-empty-sub">Customer messages will appear here</span>
                </div>
            </div>
        </div>
    )
}

export default Messages