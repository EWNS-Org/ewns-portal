import toast from "react-hot-toast";
import { del, get, put, post } from "./api-service";



export const addCategoriesData = async (businessId: string, payload: any) => {
    try {
        const res: any = await post(`/category/create?businessId=${businessId}`, payload);

        return res.data;
    } catch (error: any) {
        toast.error(error.message || error);
        console.log(error)
    }
}


export const getAllCategoriesData = async (businessId: string) => {
    try {
        const res: any = await get(`/category/getAll?businessId=${businessId}`);

        return res.data;
    } catch (error: any) {
        toast.error(error.message || error);
        console.log(error)
    }
}

export const getCategoryDetailsData = async (businessId: any, categoryId: any) => {
    try {
        const res: any = await get(`/category/get?businessId=${businessId}&categoryId=${categoryId}`);

        return res.data;
    } catch (error: any) {
        toast.error(error.message || error);
        console.log(error)
    }
}

export const getSubCategoryDetailsData = async (businessId: any, categoryId: any, subCategoryId: any) => {
    try {
        const res: any = await get(`/category/sub/get?businessId=${businessId}&categoryId=${categoryId}&subCategoryId=${subCategoryId}`);

        return res.data;
    } catch (error: any) {
        toast.error(error.message || error);
        console.log(error)
    }
}

export const updateCategoryData = async (businessId: string, categoryId: any, payload: any) => {
    try {
        const res: any = await put(`/category/update?businessId=${businessId}&categoryId=${categoryId}`, {...payload});

        return res.data;
    } catch (error: any) {
        toast.error(error.message || error);
        console.log(error)
    }
}

export const deleteCategoryData = async (businessId: string, categoryId: any) => {
    try {
        const res: any = await del(`/category/delete?businessId=${businessId}&categoryId=${categoryId}`);

        return res.data;
    } catch (error: any) {
        toast.error(error.message || error);
        console.log(error)
    }
}

export const addSubCategoryData = async (businessId: string, categoryId: any, parentCategoryId: any, payload: any) => {
    try {
        const res: any = await post(`/category/sub/create?businessId=${businessId}&categoryId=${categoryId}&parentCategoryId=${parentCategoryId}`, {...payload});
        console.log(`/category/sub/create?businessId=${businessId}&categoryId=${categoryId}&parentCategoryId=${parentCategoryId}`);
        return res.data;
    } catch (error: any) {
        toast.error(error.message || error);
        console.log(error)
    }
}

export const updateSubCategoryData = async (businessId: string, categoryId: any, subCategoryId: any, payload: any) => {
    try {
        const res: any = await put(`/category/sub/update?businessId=${businessId}&categoryId=${categoryId}&subCategoryId=${subCategoryId}`, {...payload});

        return res.data;
    } catch (error: any) {
        toast.error(error.message || error);
        console.log(error)
    }
}

export const deleteSubCategoryData = async (businessId: string, categoryId: any, subCategoryId: any) => {
    try {
        const res: any = await del(`/category/sub/delete?businessId=${businessId}&categoryId=${categoryId}&subCategoryId=${subCategoryId}`);

        return res.data;
    } catch (error: any) {
        toast.error(error.message || error);
        console.log(error)
    }
}


export const getParentCategories = async (businessId: string, subCategoryId: any) => {
    try {
        const res: any = await get(`/category/parent?businessId=${businessId}&subCategoryId=${subCategoryId}`);

        return res.data;
    } catch (error: any) {
        toast.error(error.message || error);
        console.log(error)
    }
}

