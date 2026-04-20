import toast from 'react-hot-toast';
import { get, post } from './api-service';

export const generateMetaForPage = async (businessId: string, pageType: string) => {
    try {
        const res: any = await post(`/seo/ai/meta/generate?businessId=${businessId}`, { pageType });
        return res.data;
    } catch (error: any) {
        toast.error(error.message || error);
    }
};

export const bulkGenerateMeta = async (businessId: string) => {
    try {
        const res: any = await post(`/seo/ai/meta/bulk-generate?businessId=${businessId}`, {});
        return res.data;
    } catch (error: any) {
        toast.error(error.message || error);
    }
};

export const auditSEO = async (businessId: string) => {
    try {
        const res: any = await get(`/seo/ai/audit?businessId=${businessId}`);
        return res.data;
    } catch (error: any) {
        toast.error(error.message || error);
    }
};

export const keywordResearch = async (businessId: string, topic: string) => {
    try {
        const res: any = await post(`/seo/ai/keywords/research?businessId=${businessId}`, { topic });
        return res.data;
    } catch (error: any) {
        toast.error(error.message || error);
    }
};

export const competitorKeywords = async (businessId: string) => {
    try {
        const res: any = await get(`/seo/ai/keywords/competitor?businessId=${businessId}`);
        return res.data;
    } catch (error: any) {
        toast.error(error.message || error);
    }
};

export const blogSEOSuggestions = async (businessId: string) => {
    try {
        const res: any = await get(`/seo/ai/blog-suggestions?businessId=${businessId}`);
        return res.data;
    } catch (error: any) {
        toast.error(error.message || error);
    }
};
