'use client';

import React, { useState } from 'react'
import AllProducts from './AllProducts';
import AddProduct from './AddProduct';
import "./Products.css"

const TABS = [
    { key: 'All Products', label: 'All Products', icon: '🛍️' },
    { key: 'Add Product', label: 'Add Product', icon: '➕' },
];

function Products() {
    const [activeTab, setActiveTab] = useState('All Products');

    return (
        <div className="pg-root">
            <div className="pg-header">
                <h1 className="pg-title">Products</h1>
                <p className="pg-subtitle">Manage and add products to your store</p>
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
                {activeTab === 'All Products' && <AllProducts handleTabChange={setActiveTab} />}
                {activeTab === 'Add Product' && <AddProduct />}
            </div>
        </div>
    );
}

export default Products