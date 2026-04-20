'use client';

import React, { useState } from 'react'
import AllCategories from './AllCategories';
import Testimonials from './Testimonials';

const TABS = [
    { key: 'Categories', label: 'Categories', icon: '🗂️' },
    { key: 'Testimonials', label: 'Testimonials', icon: '💬' },
];

function Categories() {
    const [activeTab, setActiveTab] = useState('Categories');

    return (
        <div className="pg-root">
            <div className="pg-header">
                <h1 className="pg-title">Categories</h1>
                <p className="pg-subtitle">Manage your business categories and customer testimonials</p>
            </div>

            <div className="pg-tab-bar">
                {TABS.map((tab) => (
                    <button
                        key={tab.key}
                        className={`pg-tab-btn${activeTab === tab.key ? ' pg-tab-btn--active' : ''}`}
                        onClick={() => setActiveTab(tab.key)}
                    >
                        <span className="pg-tab-icon">{tab.icon}</span>
                        <span className="pg-tab-label">{tab.label}</span>
                    </button>
                ))}
            </div>

            <div className="pg-content">
                {activeTab === 'Categories' && <AllCategories />}
                {activeTab === 'Testimonials' && <Testimonials />}
            </div>
        </div>
    );
}

export default Categories