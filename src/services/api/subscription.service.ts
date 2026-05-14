import toast from 'react-hot-toast';
import { get, post } from './api-service';

export const getActivePaymentGateway = async (): Promise<string | null> => {
    try {
        const res: any = await get('/payment/active-gateway');
        return res?.data?.provider ?? null;
    } catch {
        return null;
    }
};

export const getSubscriptionPlans = async () => {
    try {
        const res: any = await get('/subscription/all');
        return res?.data ?? [];
    } catch (error: any) {
        toast.error(error.message || 'Failed to fetch subscription plans');
        return [];
    }
};

export const initiateSubscriptionPayment = async (businessId: string, planId: string) => {
    try {
        const res: any = await get(`/payment/create?businessId=${businessId}&planId=${planId}`);
        return res?.data ?? null;
    } catch (error: any) {
        toast.error(error.message || 'Failed to initiate payment');
        return null;
    }
};

export const verifySubscriptionPayment = async (businessId: string, gateway: string, paymentResponse: object) => {
    try {
        const res: any = await post(`/payment/verify?businessId=${businessId}`, { gateway, ...paymentResponse });
        return res?.isSuccess ?? false;
    } catch (error: any) {
        toast.error(error.message || 'Payment verification failed');
        return false;
    }
};

export const getAddonCreditsPacks = async () => {
    try {
        const res: any = await get('/payment/addon-credits/packs');
        return res?.data ?? [];
    } catch (error: any) {
        toast.error(error.message || 'Failed to fetch addon packs');
        return [];
    }
};

export const getAiCreditsBalance = async (businessId: string) => {
    try {
        const res: any = await get(`/payment/addon-credits/balance?businessId=${businessId}`);
        return res?.data ?? null;
    } catch {
        return null;
    }
};

export const initiateAddonCreditsPayment = async (businessId: string, packId: string) => {
    try {
        const res: any = await get(`/payment/addon-credits/create?businessId=${businessId}&packId=${packId}`);
        return res?.data ?? null;
    } catch (error: any) {
        toast.error(error.message || 'Failed to initiate addon payment');
        return null;
    }
};

export const verifyAddonCreditsPayment = async (businessId: string, gateway: string, paymentResponse: object) => {
    try {
        const res: any = await post(`/payment/addon-credits/verify?businessId=${businessId}`, { gateway, ...paymentResponse });
        return res?.isSuccess ?? false;
    } catch (error: any) {
        toast.error(error.message || 'Addon payment verification failed');
        return false;
    }
};
