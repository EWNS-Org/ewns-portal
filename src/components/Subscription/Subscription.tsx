'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { CircularProgress } from '@mui/material';
import toast from 'react-hot-toast';
import {
    getSubscriptionPlans,
    initiateSubscriptionPayment,
    verifySubscriptionPayment,
    getAddonCreditsPacks,
    getAiCreditsBalance,
    initiateAddonCreditsPayment,
    verifyAddonCreditsPayment,
} from '@/services/api/subscription.service';
import { ACTIVE_BUSINESS_ID } from '@/utils/constants';
import './Subscription.css';

const PLAN_ORDER = ['BASIC_FREE', 'PRO_WEEKLY_TRIAL', 'PRO_MONTHLY', 'PRO_QUARTERLY', 'PRO_ANNUALLY'];

function loadRazorpay(): Promise<boolean> {
    return new Promise((resolve) => {
        if ((window as any).Razorpay) { resolve(true); return; }
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
}

export default function Subscription() {
    const [tab, setTab] = useState<'plans' | 'credits'>('plans');
    const [plans, setPlans] = useState<any[]>([]);
    const [addonPacks, setAddonPacks] = useState<any[]>([]);
    const [creditsBalance, setCreditsBalance] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [payingPlanId, setPayingPlanId] = useState<string | null>(null);
    const [payingPackId, setPayingPackId] = useState<string | null>(null);
    const [currentPlan, setCurrentPlan] = useState<string | null>(null);

    const businessId = typeof window !== 'undefined' ? localStorage.getItem(ACTIVE_BUSINESS_ID) : null;

    const fetchData = useCallback(async () => {
        if (!businessId) return;
        setLoading(true);
        const [plansData, packsData, balance, userRaw] = await Promise.all([
            getSubscriptionPlans(),
            getAddonCreditsPacks(),
            getAiCreditsBalance(businessId),
            typeof window !== 'undefined' ? localStorage.getItem('user') : null,
        ]);
        const sorted = [...plansData].sort(
            (a: any, b: any) => PLAN_ORDER.indexOf(a.subscriptionId) - PLAN_ORDER.indexOf(b.subscriptionId)
        );
        setPlans(sorted);
        setAddonPacks(packsData);
        setCreditsBalance(balance);
        if (userRaw) {
            try {
                const user = JSON.parse(userRaw);
                setCurrentPlan(user?.subscriptionDetails?.subscriptionId ?? 'BASIC_FREE');
            } catch { /* noop */ }
        }
        setLoading(false);
    }, [businessId]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleUpgrade = async (plan: any) => {
        if (!businessId) return;
        const ok = await loadRazorpay();
        if (!ok) { toast.error('Payment gateway could not be loaded'); return; }
        setPayingPlanId(plan.subscriptionId);
        const order = await initiateSubscriptionPayment(businessId, plan.subscriptionId);
        if (!order) { setPayingPlanId(null); return; }

        const rzp = new (window as any).Razorpay({
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: order.currency,
            order_id: order.id,
            name: 'EWNS',
            description: plan.name,
            handler: async (response: any) => {
                const verified = await verifySubscriptionPayment(businessId, response);
                if (verified) {
                    toast.success(`Upgraded to ${plan.name}!`);
                    fetchData();
                }
                setPayingPlanId(null);
            },
            modal: { ondismiss: () => setPayingPlanId(null) },
        });
        rzp.open();
    };

    const handleBuyAddon = async (pack: any) => {
        if (!businessId) return;
        const ok = await loadRazorpay();
        if (!ok) { toast.error('Payment gateway could not be loaded'); return; }
        setPayingPackId(pack._id);
        const order = await initiateAddonCreditsPayment(businessId, pack._id);
        if (!order) { setPayingPackId(null); return; }

        const rzp = new (window as any).Razorpay({
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: order.currency,
            order_id: order.id,
            name: 'EWNS',
            description: `${pack.credits.toLocaleString()} AI Credits`,
            handler: async (response: any) => {
                const verified = await verifyAddonCreditsPayment(businessId, response);
                if (verified) {
                    toast.success(`${pack.credits.toLocaleString()} credits added!`);
                    fetchData();
                }
                setPayingPackId(null);
            },
            modal: { ondismiss: () => setPayingPackId(null) },
        });
        rzp.open();
    };

    const totalCredits = (creditsBalance?.planCredits ?? 0) + (creditsBalance?.addonCredits ?? 0);

    return (
        <div className="pg-root">
            <div className="pg-header">
                <h1 className="pg-title">Subscription & AI Credits</h1>
                <p className="pg-subtitle">Manage your plan, billing, and AI usage credits</p>
            </div>

            <div className="pg-tab-bar" style={{ marginBottom: 24 }}>
                <button
                    className={`pg-tab-btn ${tab === 'plans' ? 'pg-tab-btn--active' : ''}`}
                    onClick={() => setTab('plans')}
                >
                    <span className="pg-tab-icon">💳</span>
                    <span className="pg-tab-label">Plans</span>
                </button>
                <button
                    className={`pg-tab-btn ${tab === 'credits' ? 'pg-tab-btn--active' : ''}`}
                    onClick={() => setTab('credits')}
                >
                    <span className="pg-tab-icon">⚡</span>
                    <span className="pg-tab-label">AI Credits</span>
                </button>
            </div>

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
                    <CircularProgress style={{ color: '#7c3aed' }} />
                </div>
            ) : (
                <>
                    {tab === 'plans' && (
                        <div className="sub-plans-grid">
                            {plans.map((plan) => {
                                const isCurrent = plan.subscriptionId === currentPlan;
                                const isFree = plan.subscriptionId === 'BASIC_FREE';
                                const isPaying = payingPlanId === plan.subscriptionId;
                                return (
                                    <div key={plan._id} className={`sub-plan-card ${isCurrent ? 'sub-plan-card--active' : ''}`}>
                                        {isCurrent && <span className="sub-plan-badge">Current Plan</span>}
                                        <div className="sub-plan-name">{plan.name}</div>
                                        <div className="sub-plan-price">
                                            {isFree ? (
                                                <span className="sub-plan-price__amount">Free</span>
                                            ) : (
                                                <>
                                                    <span className="sub-plan-price__currency">₹</span>
                                                    <span className="sub-plan-price__amount">{parseInt(plan.price).toLocaleString()}</span>
                                                    <span className="sub-plan-price__period">/{plan.type?.toLowerCase()}</span>
                                                </>
                                            )}
                                        </div>

                                        <div className="sub-plan-credits">
                                            <span className="sub-plan-credits__icon">⚡</span>
                                            <span>{(plan.aiCredits?.credits ?? 0).toLocaleString()} AI Credits</span>
                                        </div>

                                        {plan.limitations && (
                                            <ul className="sub-plan-features">
                                                <li>🏢 {plan.limitations.businesses} Business{plan.limitations.businesses !== 1 ? 'es' : ''}</li>
                                                <li>🛠️ {plan.limitations.services} Services</li>
                                                <li>📝 {plan.limitations.blogs} Blogs</li>
                                                <li>📦 {plan.limitations.products} Products</li>
                                                <li>🗂️ {plan.limitations.albums} Albums</li>
                                            </ul>
                                        )}

                                        {plan.details && (
                                            <p className="sub-plan-details">{plan.details}</p>
                                        )}

                                        {!isCurrent && !isFree && (
                                            <button
                                                className="pg-btn pg-btn--primary sub-plan-cta"
                                                onClick={() => handleUpgrade(plan)}
                                                disabled={!!payingPlanId}
                                            >
                                                {isPaying ? <CircularProgress size={16} color="inherit" /> : 'Upgrade'}
                                            </button>
                                        )}
                                        {isCurrent && (
                                            <div className="sub-plan-current-label">✅ Active</div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {tab === 'credits' && (
                        <>
                            {/* Balance card */}
                            <div className="pg-card" style={{ marginBottom: 20 }}>
                                <div className="sub-credits-header">
                                    <div>
                                        <p className="pg-section-title" style={{ margin: 0 }}>AI Credits Balance</p>
                                        <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>
                                            Plan credits reset monthly for Basic users. Addon credits never expire.
                                        </p>
                                    </div>
                                    <div className="sub-credits-total">
                                        <span className="sub-credits-total__number">{totalCredits.toLocaleString()}</span>
                                        <span className="sub-credits-total__label">Total</span>
                                    </div>
                                </div>

                                <div className="sub-credits-breakdown">
                                    <div className="sub-credits-item">
                                        <span className="sub-credits-item__label">Plan Credits</span>
                                        <span className="sub-credits-item__value sub-credits-item__value--plan">
                                            {(creditsBalance?.planCredits ?? 0).toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="sub-credits-item">
                                        <span className="sub-credits-item__label">Addon Credits</span>
                                        <span className="sub-credits-item__value sub-credits-item__value--addon">
                                            {(creditsBalance?.addonCredits ?? 0).toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                {totalCredits === 0 && (
                                    <div className="sub-credits-empty-warn">
                                        ⚠️ You have no AI credits remaining. Purchase an addon pack below.
                                    </div>
                                )}
                            </div>

                            {/* Addon packs */}
                            <p className="pg-section-title">Buy Addon Credits</p>
                            <div className="sub-addon-grid">
                                {addonPacks.map((pack) => {
                                    const isPaying = payingPackId === pack._id;
                                    return (
                                        <div key={pack._id} className="sub-addon-card">
                                            <div className="sub-addon-credits">{pack.credits.toLocaleString()}</div>
                                            <div className="sub-addon-credits-label">AI Credits</div>
                                            <div className="sub-addon-price">
                                                ₹{pack.price.toLocaleString()}
                                            </div>
                                            <button
                                                className="pg-btn pg-btn--primary sub-addon-btn"
                                                onClick={() => handleBuyAddon(pack)}
                                                disabled={!!payingPackId}
                                            >
                                                {isPaying ? <CircularProgress size={16} color="inherit" /> : 'Buy Now'}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
}
