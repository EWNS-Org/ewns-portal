import toast from "react-hot-toast";
import { del, get, post, put } from "./api-service"


export const getAllBusinesses = async () => {
    try {

        const res: any = await get(`/business/get/all`);

        return res.data;
    } catch (error: any) {
        toast.error(error.message || error);
        console.log(error)
    }

}

export const getBusinessDetails = async (businessId: string) => {
    try {
        const res: any = await get(`/business/get?businessId=${businessId}`);

        return res.data;
    } catch (error: any) {
        toast.error(error.message || error);
        console.log(error)
    }

}


export const createBusiness = async (businessDetails: any) => {
    try {
        const res: any = await post(`/business/create`, businessDetails);

        return res.data;
    }
    catch (error: any) {
        toast.error(error.message || error);
        console.log(error)
    }
}

export const updateBusiness = async (businessDetails: any, businessId: any) => {
    try {
        let updateData = { ...businessDetails };
        delete updateData._id;
        delete updateData._v;
        delete updateData.userId;
        delete updateData.createdOn;
        delete updateData.updatedOn;

        const res: any = await put(`/business/update?businessId=${businessId}`, businessDetails);

        return res.data;
    }
    catch (error: any) {
        toast.error(error.message || error);
        console.log(error)
    }
}

export const uploadBusinessImages = async (businessId: any, bodyData: any) => {
    try {
        const res: any = await post(`/business/upload?businessId=${businessId}`, bodyData);
        return res.data;
    }
    catch (error: any) {
        toast.error(error.message || error);
        console.log(error)
    }
}

export const createBusinessLink = async (linkData: any, businessId: any) => {
    try {
        let body = {
            logo: linkData.logo,
            title: linkData.title,
            url: linkData.url,
        }
        const res: any = await post(`/business/link/create?businessId=${businessId}`, body);
        return res.data;
    } catch (error: any) {
        toast.error(error.message || error);
        console.log(error)
    }

}

export const updateBusinessLink = async (linkData: any, businessId: any, linkId: any) => {
    try {
        let body = {
            logo: linkData.logo,
            title: linkData.title,
            url: linkData.url,
        }
        const res: any = await put(`/business/link/update?businessId=${businessId}&linkId=${linkId}`, body);
        return res.data;
    } catch (error: any) {
        toast.error(error.message || error);
        console.log(error)
    }

}

export const getAllBusinessLinks = async (businessId: any) => {
    try {
        const res: any = await get(`/business/link/getAll?businessId=${businessId}`);
        return res.data;
    } catch (error: any) {
        toast.error(error.message || error);
        console.log(error)
    }
}

export const deleteBusinessLink = async (businessId: any, linkId: any) => {
    try {
        const res: any = await del(`/business/link/delete?businessId=${businessId}&linkId=${linkId}`);
        return res.data;
    } catch (error: any) {
        toast.error(error.message || error);
        console.log(error)
    }
}

export const createBusinessFAQ = async (faqData: any, businessId: any) => {
    try {
        let body = {
            question: faqData.question,
            answer: faqData.answer,
        }
        const res: any = await post(`/business/faq/create?businessId=${businessId}`, body);
        return res.data;
    } catch (error: any) {
        toast.error(error.message || error);
        console.log(error)
    }

}

export const updateBusinessFAQ = async (faqData: any, businessId: any, faqId: any) => {
    try {
        let body = {
            question: faqData.question,
            answer: faqData.answer,
        }
        const res: any = await put(`/business/faq/update?businessId=${businessId}&faqId=${faqId}`, body);
        return res.data;
    } catch (error: any) {
        toast.error(error.message || error);
        console.log(error)
    }

}

export const getAllBusinessFAQs = async (businessId: any) => {
    try {
        const res: any = await get(`/business/faq/getAll?businessId=${businessId}`);
        console.log(res.data);
        return res.data;
    } catch (error: any) {
        toast.error(error.message || error);
        console.log(error)
    }
}

export const deleteBusinessFAQ = async (businessId: any, faqId: any) => {
    try {
        const res: any = await del(`/business/faq/delete?businessId=${businessId}&faqId=${faqId}`);
        return res.data;
    } catch (error: any) {
        toast.error(error.message || error);
        console.log(error)
    }
}

export const toggleBusinessFAQ = async (businessId: any, faqId: any, isActive: any) => {
    try {
        const res: any = await get(`/business/faq/active?businessId=${businessId}&faqId=${faqId}&isActive=${isActive}`);
        return res.data;
    } catch (error: any) {
        toast.error(error.message || error);
        console.log(error)
    }
}