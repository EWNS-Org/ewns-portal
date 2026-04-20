import toast from 'react-hot-toast';
import { del, get, put, post } from './api-service';

export const getAllServicesData = async (businessId: string) => {
    try {
        const res: any = await get(`/service/getAll?businessId=${businessId}`);
        return res.data;
    } catch (error: any) {
        toast.error(error.message || error);
    }
};

export const getServiceDetailsData = async (businessId: string, serviceId: string) => {
    try {
        const res: any = await get(`/service/get?businessId=${businessId}&serviceId=${serviceId}`);
        return res.data;
    } catch (error: any) {
        toast.error(error.message || error);
    }
};

export const addServiceData = async (businessId: string, payload: any) => {
    try {
        const formData = new FormData();
        const { files, ...rest } = payload;
        formData.append('data', JSON.stringify(rest));
        if (files && files.length > 0) {
            files.forEach((file: File) => formData.append('files', file));
        }
        const res: any = await post(`/service/create?businessId=${businessId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return res.data;
    } catch (error: any) {
        toast.error(error.message || error);
    }
};

export const updateServiceData = async (businessId: string, serviceId: string, payload: any) => {
    try {
        const res: any = await put(`/service/update?businessId=${businessId}&serviceId=${serviceId}`, payload);
        return res.data;
    } catch (error: any) {
        toast.error(error.message || error);
    }
};

export const deleteServiceData = async (businessId: string, serviceId: string) => {
    try {
        const res: any = await del(`/service/delete?businessId=${businessId}&serviceId=${serviceId}`);
        return res.data;
    } catch (error: any) {
        toast.error(error.message || error);
    }
};

export const toggleServiceData = async (businessId: string, serviceId: string, isActive: boolean) => {
    try {
        const res: any = await get(`/service/toggle?businessId=${businessId}&serviceId=${serviceId}&isActive=${isActive}`);
        return res.data;
    } catch (error: any) {
        toast.error(error.message || error);
    }
};
