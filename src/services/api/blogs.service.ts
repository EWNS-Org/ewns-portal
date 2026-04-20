import toast from 'react-hot-toast';
import { del, get, put, post } from './api-service';

export const getAllBlogsData = async (businessId: string) => {
    try {
        const res: any = await get(`/blog/getAll?businessId=${businessId}`);
        return res.data;
    } catch (error: any) {
        toast.error(error.message || error);
    }
};

export const getBlogDetailsData = async (businessId: string, blogId: string) => {
    try {
        const res: any = await get(`/blog/get?businessId=${businessId}&blogId=${blogId}`);
        return res.data;
    } catch (error: any) {
        toast.error(error.message || error);
    }
};

export const addBlogData = async (businessId: string, payload: any) => {
    try {
        const formData = new FormData();
        const { files, ...rest } = payload;
        formData.append('data', JSON.stringify(rest));
        if (files && files.length > 0) {
            files.forEach((file: File) => formData.append('files', file));
        }
        const res: any = await post(`/blog/create?businessId=${businessId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return res.data;
    } catch (error: any) {
        toast.error(error.message || error);
    }
};

export const updateBlogData = async (businessId: string, blogId: string, payload: any) => {
    try {
        const res: any = await put(`/blog/update?businessId=${businessId}&blogId=${blogId}`, payload);
        return res.data;
    } catch (error: any) {
        toast.error(error.message || error);
    }
};

export const deleteBlogData = async (businessId: string, blogId: string) => {
    try {
        const res: any = await del(`/blog/delete?businessId=${businessId}&blogId=${blogId}`);
        return res.data;
    } catch (error: any) {
        toast.error(error.message || error);
    }
};

export const toggleBlogData = async (businessId: string, blogId: string, isActive: boolean) => {
    try {
        const res: any = await get(`/blog/toggle?businessId=${businessId}&blogId=${blogId}&isActive=${isActive}`);
        return res.data;
    } catch (error: any) {
        toast.error(error.message || error);
    }
};
