import { get, post, put, del } from './api-service';

// ─── Subscription Plans ───────────────────────────────────────────────────────

export const getAllSubscriptionPlans = async () => {
    const res: any = await get('/admin/plans/getAll');
    return res;
};

export const getSubscriptionPlanById = async (planId: string) => {
    const res: any = await get(`/admin/plans/get?planId=${planId}`);
    return res;
};

export const addSubscriptionPlan = async (data: any) => {
    const res: any = await post('/admin/plans/add', data);
    return res;
};

export const updateSubscriptionPlan = async (planId: string, data: any) => {
    const res: any = await put(`/admin/plans/update?planId=${planId}`, data);
    return res;
};

export const deleteSubscriptionPlan = async (planId: string) => {
    const res: any = await del(`/admin/plans/delete?planId=${planId}`);
    return res;
};

// ─── Addon Packs ─────────────────────────────────────────────────────────────

export const getAllAddonPacks = async () => {
    const res: any = await get('/admin/addon/getAll');
    return res;
};

export const getAddonPackById = async (packId: string) => {
    const res: any = await get(`/admin/addon/get?packId=${packId}`);
    return res;
};

export const addAddonPack = async (data: any) => {
    const res: any = await post('/admin/addon/add', data);
    return res;
};

export const updateAddonPack = async (packId: string, data: any) => {
    const res: any = await put(`/admin/addon/update?packId=${packId}`, data);
    return res;
};

export const deleteAddonPack = async (packId: string) => {
    const res: any = await del(`/admin/addon/delete?packId=${packId}`);
    return res;
};

// ─── Seed ─────────────────────────────────────────────────────────────────────

export const seedSubscriptionData = async (type: 'plans' | 'addons' | 'all') => {
    const res: any = await post(`/admin/seed?type=${type}`, {});
    return res;
};
