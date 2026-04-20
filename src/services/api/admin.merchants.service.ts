import { get, put } from './api-service';

export const getAllMerchants = async (params: Record<string, any> = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '' && value !== null) {
            query.append(key, String(value));
        }
    });
    const res: any = await get(`/admin/merchants/getAll?${query.toString()}`);
    return res;
};

export const toggleMerchantStatus = async (userId: string) => {
    const res: any = await put('/admin/merchants/toggleStatus', { userId });
    return res;
};

export const getAllBusinessesAdmin = async (params: Record<string, any> = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '' && value !== null) {
            query.append(key, String(value));
        }
    });
    const res: any = await get(`/admin/businesses/getAll?${query.toString()}`);
    return res;
};
