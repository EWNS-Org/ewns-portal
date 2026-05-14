import { get, post, put, del } from './api-service';

// ─── Third Party Configurations ───────────────────────────────────────────────

export const getAllThirdPartyConfigs = async () => {
    const res: any = await get('/admin/thirdparty/getAll');
    return res;
};

export const getThirdPartyConfigsByCategory = async (category: string) => {
    const res: any = await get(`/admin/thirdparty/getByCategory?category=${category}`);
    return res;
};

export const getActiveThirdPartyConfig = async (category: string) => {
    const res: any = await get(`/admin/thirdparty/getActive?category=${category}`);
    return res;
};

export const upsertThirdPartyConfig = async (provider: string, credentials: { key: string; value: string }[]) => {
    const res: any = await post('/admin/thirdparty/upsert', { provider, credentials });
    return res;
};

export const setActiveThirdPartyProvider = async (provider: string) => {
    const res: any = await put('/admin/thirdparty/setActive', { provider });
    return res;
};

export const deleteThirdPartyConfig = async (provider: string) => {
    const res: any = await del(`/admin/thirdparty/delete?provider=${provider}`);
    return res;
};
