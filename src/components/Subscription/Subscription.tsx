'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CircularProgress } from '@mui/material';
import toast from 'react-hot-toast';
import {
    getActivePaymentGateway,
    getSubscriptionPlans,
    initiateSubscriptionPayment,
    verifySubscriptionPayment,
    getAddonCreditsPacks,
    getAiCreditsBalance,
    initiateAddonCreditsPayment,
    verifyAddonCreditsPayment,
} from '@/services/api/subscription.service';
import { getBusinessDetailsAction } from '@/Redux/Actions/BusinessActions/business.actions';
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

function submitPayUForm(order: any) {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = order.payuUrl;
    const fields: Record<string, string> = {
        key: order.key,
        txnid: order.txnid,
        amount: order.amount,
        productinfo: order.productinfo,
        firstname: order.firstname,
        email: order.email,
        phone: order.phone,
        hash: order.hash,
        udf1: order.udf1 ?? '',
        udf2: order.udf2 ?? '',
        udf3: order.udf3 ?? '',
        udf4: '',
        udf5: '',
        surl: order.surl,
        furl: order.furl,
    };
    for (const [name, value] of Object.entries(fields)) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = value;
        form.appendChild(input);
    }
    document.body.appendChild(form);
    form.submit();
}

export default function Subscription() {
    const [tab, setTab] = useState<'plans' | 'credits'>('plans');
    const [plans, setPlans] = useState<any[]>([]);
    const [addonPacks, setAddonPacks] = useState<any[]>([]);
    const [creditsBalance, setCreditsBalance] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [payingPlanId, setPayingPlanId] = useState<string | null>(null);
    const [payingPackId, setPayingPackId] = useState<string | null>(null);
    const [activeGateway, setActiveGateway] = useState<string | null>(null);

    const dispatch = useDispatch();
    const { business } = useSelector((state: any) => state);
    const businessDetails = business?.businessDetails;
    const subscriptionDetails = businessDetails?.subscriptionDetails;
    const currentPlan = subscriptionDetails?.subscriptionId ?? 'BASIC_FREE';

    const businessId = typeof window !== 'undefined' ? localStorage.getItem(ACTIVE_BUSINESS_ID) : null;

    const fetchData = useCallback(async () => {
        if (!businessId) return;
        setLoading(true);
        const [plansData, packsData, balance, gateway] = await Promise.all([
            getSubscriptionPlans(),
            getAddonCreditsPacks(),
            getAiCreditsBalance(businessId),
            getActivePaymentGateway(),
        ]);
        dispatch(getBusinessDetailsAction(businessId) as any);
        const sorted = [...plansData].sort(
            (a: any, b: any) => PLAN_ORDER.indexOf(a.subscriptionId) - PLAN_ORDER.indexOf(b.subscriptionId)
        );
        setPlans(sorted);
        setAddonPacks(packsData);
        setCreditsBalance(balance);
        setActiveGateway(gateway);
        setLoading(false);
    }, [businessId]);

    useEffect(() => { fetchData(); }, [fetchData]);

    // Handle PayU redirect return
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const status = params.get('status');
        const tab = params.get('tab');
        if (status) {
            window.history.replaceState({}, '', window.location.pathname);
            if (status === 'success') {
                toast.success(tab === 'credits' ? 'Credits added successfully!' : 'Subscription upgraded successfully!');
                fetchData();
                if (tab === 'credits') setTab('credits');
            } else {
                toast.error('Payment failed or was cancelled. Please try again.');
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleUpgrade = async (plan: any) => {
        if (!businessId || payingPlanId) return;
        setPayingPlanId(plan.subscriptionId);

        const order = await initiateSubscriptionPayment(businessId, plan.subscriptionId);
        if (!order) { setPayingPlanId(null); return; }

        if (order.gateway === 'RAZORPAY') {
            const ok = await loadRazorpay();
            if (!ok) { toast.error('Payment gateway could not be loaded'); setPayingPlanId(null); return; }

            const rzp = new (window as any).Razorpay({
                key: order.key,
                amount: order.amount,
                currency: order.currency,
                order_id: order.id,
                name: 'EWNS',
                description: plan.name,
                handler: async (response: any) => {
                    const verified = await verifySubscriptionPayment(businessId, 'RAZORPAY', response);
                    if (verified) {
                        toast.success(`Upgraded to ${plan.name}!`);
                        fetchData();
                        dispatch(getBusinessDetailsAction(businessId) as any);
                    }
                    setPayingPlanId(null);
                },
                modal: { ondismiss: () => setPayingPlanId(null) },
            });
            rzp.open();
            return;
        }

        if (order.gateway === 'PAYU') {
            submitPayUForm(order);
            return;
        }

        toast.error('Unsupported payment gateway');
        setPayingPlanId(null);
    };

    const handleBuyAddon = async (pack: any) => {
        if (!businessId || payingPackId) return;
        setPayingPackId(pack._id);

        const order = await initiateAddonCreditsPayment(businessId, pack._id);
        if (!order) { setPayingPackId(null); return; }

        if (order.gateway === 'RAZORPAY') {
            const ok = await loadRazorpay();
            if (!ok) { toast.error('Payment gateway could not be loaded'); setPayingPackId(null); return; }

            const rzp = new (window as any).Razorpay({
                key: order.key,
                amount: order.amount,
                currency: order.currency,
                order_id: order.id,
                name: 'EWNS',
                description: `${pack.credits.toLocaleString()} AI Credits`,
                handler: async (response: any) => {
                    const verified = await verifyAddonCreditsPayment(businessId, 'RAZORPAY', response);
                    if (verified) {
                        toast.success(`${pack.credits.toLocaleString()} credits added!`);
                        fetchData();
                    }
                    setPayingPackId(null);
                },
                modal: { ondismiss: () => setPayingPackId(null) },
            });
            rzp.open();
            return;
        }

        if (order.gateway === 'PAYU') {
            submitPayUForm(order);
            return;
        }

        toast.error('Unsupported payment gateway');
        setPayingPackId(null);
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
                                const currentPlanIdx = PLAN_ORDER.indexOf(currentPlan);
                                const planIdx = PLAN_ORDER.indexOf(plan.subscriptionId);
                                const isCurrent = plan.subscriptionId === currentPlan;
                                const isFree = plan.subscriptionId === 'BASIC_FREE';
                                const isLower = planIdx < currentPlanIdx;
                                const isHigher = planIdx > currentPlanIdx;
                                const isPaying = payingPlanId === plan.subscriptionId;
                                const discountPct = parseInt(plan.discount?.value ?? '0');
                                const hasDiscount = discountPct > 0 && plan.discount?.type === 'percentage';
                                const originalPrice = hasDiscount
                                    ? Math.round(parseInt(plan.price) / (1 - discountPct / 100))
                                    : parseInt(plan.price);

                                // Prorated price for upgrades
                                const currentPlanObj = plans.find(p => p.subscriptionId === currentPlan);
                                const remainingDays = subscriptionDetails?.endDate
                                    ? Math.max(0, (new Date(subscriptionDetails.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                                    : 0;
                                const currentCredit = (currentPlanObj && parseInt(currentPlanObj.price) > 0)
                                    ? parseInt(currentPlanObj.price) * (remainingDays / (currentPlanObj.noOfDays || 1))
                                    : 0;
                                const proratedPrice = Math.max(0, Math.round(parseInt(plan.price) - currentCredit));
                                const hasSavings = isHigher && currentCredit > 0;

                                return (
                                    <div key={plan._id} className={`sub-plan-card ${isCurrent ? 'sub-plan-card--active' : ''} ${isLower ? 'sub-plan-card--disabled' : ''}`}>
                                        {isCurrent && <span className="sub-plan-badge">Current Plan</span>}
                                        {hasDiscount && !isLower && <span className="sub-plan-discount-badge">{discountPct}% OFF</span>}
                                        <div className="sub-plan-name">{plan.name}</div>
                                        <div className="sub-plan-price">
                                            {isFree ? (
                                                <span className="sub-plan-price__amount">Free</span>
                                            ) : (
                                                <div className="sub-plan-price__wrapper">
                                                    {isHigher && hasSavings ? (
                                                        <>
                                                            <span className="sub-plan-price__original">₹{parseInt(plan.price).toLocaleString()}</span>
                                                            <div className="sub-plan-price__row">
                                                                <span className="sub-plan-price__currency">₹</span>
                                                                <span className="sub-plan-price__amount">{proratedPrice.toLocaleString()}</span>
                                                                <span className="sub-plan-price__period"> today</span>
                                                            </div>
                                                            <span className="sub-plan-prorated-hint">Prorated · ₹{Math.round(currentCredit).toLocaleString()} credit applied</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            {hasDiscount && (
                                                                <span className="sub-plan-price__original">₹{originalPrice.toLocaleString()}</span>
                                                            )}
                                                            <div className="sub-plan-price__row">
                                                                <span className="sub-plan-price__currency">₹</span>
                                                                <span className="sub-plan-price__amount">{parseInt(plan.price).toLocaleString()}</span>
                                                                <span className="sub-plan-price__period">/{plan.type?.toLowerCase()}</span>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        <div className="sub-plan-credits">
                                            <span className="sub-plan-credits__icon">⚡</span>
                                            <span>{(plan.aiCredits?.credits ?? 0).toLocaleString()} AI Credits</span>
                                        </div>

                                        {plan.limitations && (
                                            <ul className="sub-plan-features">
                                                {(() => {
                                                    const lim = plan.limitations;
                                                    const fmt = (n: number) => n === -1 ? 'Unlimited' : n;
                                                    return (
                                                        <>
                                                            <li>🏢 {fmt(lim.businesses)} Business{lim.businesses !== 1 && lim.businesses !== -1 ? 'es' : lim.businesses === -1 ? 'es' : ''}</li>
                                                            <li>🛠️ {fmt(lim.services)} Services</li>
                                                            <li>📝 {fmt(lim.blogs)} Blogs</li>
                                                            <li>📦 {fmt(lim.products)} Products</li>
                                                            <li>🗂️ {fmt(lim.albums)} Albums</li>
                                                        </>
                                                    );
                                                })()}
                                            </ul>
                                        )}

                                        {plan.details && (
                                            <p className="sub-plan-details">{plan.details}</p>
                                        )}

                                        {isLower && (
                                            <div className="sub-plan-lower-label">Not Available</div>
                                        )}
                                        {!isCurrent && !isFree && !isLower && (
                                            <button
                                                className="pg-btn pg-btn--primary sub-plan-cta"
                                                onClick={() => handleUpgrade(plan)}
                                                disabled={!!payingPlanId}
                                            >
                                                {isPaying ? <CircularProgress size={16} color="inherit" /> : (isHigher && hasSavings ? 'Upgrade (Prorated)' : 'Upgrade')}
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
