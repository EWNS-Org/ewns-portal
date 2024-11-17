import toast from "react-hot-toast";
import { post, get, put, del } from "./api-service";



export const createBlogData = async (businessId: string, payload: any) => {
    try {
        const res: any = await post(`/blog/create?businessId=${businessId}`, payload);

        return res.data;
    } catch (error: any) {
        toast.error(error.message || error);
        console.log(error)
    }
}


export const getAllBlogsData = async (businessId: string) => {
    try {
        const res: any = await get(`/blog/getAll?businessId=${businessId}`);

        return res.data;
    } catch (error: any) {
        toast.error(error.message || error);
        console.log(error)
    }
}

export const getBlogDetailsData = async (businessId: any, blogId: any) => {
    try {
        const res: any = await get(`/blog/get?businessId=${businessId}&blogId=${blogId}`);

        return res.data;
    } catch (error: any) {
        toast.error(error.message || error);
        console.log(error)
    }
}

export const updateBlogData = async (businessId: string, blogId: any, payload: any) => {
    try {
        const res: any = await put(`/blog/update?businessId=${businessId}&blogId=${blogId}`, {...payload});

        return res.data;
    } catch (error: any) {
        toast.error(error.message || error);
        console.log(error)
    }
}

export const deleteBlogData = async (businessId: string, blogId: any) => {
    try {
        const res: any = await del(`/blog/delete?businessId=${businessId}&blogId=${blogId}`);

        return res.data;
    } catch (error: any) {
        toast.error(error.message || error);
        console.log(error)
    }
}


export const toggleBlogData = async (businessId: string, blogId: any, isActive: boolean) => {
    try {
        const res: any = await get(`/blog/toggle?businessId=${businessId}&blogId=${blogId}&isActive=${isActive}`);

        return res.data;
    } catch (error: any) {
        toast.error(error.message || error);
        console.log(error)
    }
}

export const addBlogMediaData = async (businessId: string, blogId: any, files: any) => {
    try {
        const res: any = await post(`/blog/addMedia?businessId=${businessId}&blogId=${blogId}`, {files: files});

        return res.data;
    } catch (error: any) {
        toast.error(error.message || error);
        console.log(error)
    }
}

export const removeFileFromBlogData = async (businessId: string, blogId: any, fileId: any) => {
    try {
        const res: any = await get(`/blog/removeMedia?businessId=${businessId}&blogId=${blogId}&fileId=${fileId}`);

        return res.data;
    } catch (error: any) {
        toast.error(error.message || error);
        console.log(error)
    }
}


export const createServiceData = async (businessId: string, payload: any) => {
    try {
        const res: any = await post(`/service/create?businessId=${businessId}`, payload);

        return res.data;
    } catch (error: any) {
        toast.error(error.message || error);
        console.log(error)
    }
}


export const getAllServicesData = async (businessId: string) => {
    try {
        const res: any = await get(`/service/getAll?businessId=${businessId}`);

        return res.data;
    } catch (error: any) {
        toast.error(error.message || error);
        console.log(error)
    }
}

export const getServiceDetailsData = async (businessId: any, serviceId: any) => {
    try {
        const res: any = await get(`/service/get?businessId=${businessId}&serviceId=${serviceId}`);

        return res.data;
    } catch (error: any) {
        toast.error(error.message || error);
        console.log(error)
    }
}

export const updateServiceData = async (businessId: string, serviceId: any, payload: any) => {
    try {
        const res: any = await put(`/service/update?businessId=${businessId}&serviceId=${serviceId}`, {...payload});

        return res.data;
    } catch (error: any) {
        toast.error(error.message || error);
        console.log(error)
    }
}

export const deleteServiceData = async (businessId: string, serviceId: any) => {
    try {
        const res: any = await del(`/service/delete?businessId=${businessId}&serviceId=${serviceId}`);

        return res.data;
    } catch (error: any) {
        toast.error(error.message || error);
        console.log(error)
    }
}


export const toggleServiceData = async (businessId: string, serviceId: any, isActive: boolean) => {
    try {
        const res: any = await get(`/service/toggle?businessId=${businessId}&serviceId=${serviceId}&isActive=${isActive}`);

        return res.data;
    } catch (error: any) {
        toast.error(error.message || error);
        console.log(error)
    }
}

export const addServiceMediaData = async (businessId: string, serviceId: any, files: any) => {
    try {
        const res: any = await post(`/service/addMedia?businessId=${businessId}&serviceId=${serviceId}`, {files: files});

        return res.data;
    } catch (error: any) {
        toast.error(error.message || error);
        console.log(error)
    }
}

export const removeFileFromServiceData = async (businessId: string, serviceId: any, fileId: any) => {
    try {
        const res: any = await get(`/service/removeMedia?businessId=${businessId}&serviceId=${serviceId}&fileId=${fileId}`);

        return res.data;
    } catch (error: any) {
        toast.error(error.message || error);
        console.log(error)
    }
}


export const getPopularServicesData = async (businessId: string) => {
    try {
        const res: any = await get(`/service/removeMedia?businessId=${businessId}`);

        return res.data;
    } catch (error: any) {
        toast.error(error.message || error);
        console.log(error)
    }
}


export const getPopularBlogsData = async (businessId: string) => {
    try {
        const res: any = await get(`/service/removeMedia?businessId=${businessId}`);

        return res.data;
    } catch (error: any) {
        toast.error(error.message || error);
        console.log(error)
    }
}

