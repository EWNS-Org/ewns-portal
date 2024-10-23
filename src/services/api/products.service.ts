import toast from "react-hot-toast";
import { del, get, put, post } from "./api-service";



export const addProductsData = async (businessId: string, payload: any) => {
    try {
        const formData = new FormData();
        // Append the product data as a JSON string
        formData.append("productData", JSON.stringify(payload));
        
        // Append each file in the payload's `files` array to the form data
        payload.files.forEach((file: File, i: number) => {
            formData.append("files", file); // Make sure the key name 'files' matches the backend expectation
        });

        // Send the form data with multipart/form-data header
        const res:any = await post(`/product/create?businessId=${businessId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return res.data;
    } catch (error: any) {
        toast.error(error.message || error);
        console.log(error)
    }
}


export const getAllProductsData = async (businessId: string, page: any, limit: any) => {
    try {
        const res: any = await get(`/product/getAll?businessId=${businessId}&page=${page}&limit=${limit}`);

        return res.data;
    } catch (error: any) {
        toast.error(error.message || error);
        console.log(error)
    }
}

export const getProductDetailsData = async (businessId: any, productId: any) => {
    try {
        const res: any = await get(`/product/get?businessId=${businessId}&productId=${productId}`);

        return res.data;
    } catch (error: any) {
        toast.error(error.message || error);
        console.log(error)
    }
}

export const updateProductData = async (businessId: string, productId: any, payload: any) => {
    try {
        const res: any = await put(`/product/update?businessId=${businessId}&productId=${productId}`, {...payload});

        return res.data;
    } catch (error: any) {
        toast.error(error.message || error);
        console.log(error)
    }
}

export const deleteProductData = async (businessId: string, productId: any) => {
    try {
        const res: any = await del(`/product/delete?businessId=${businessId}&productId=${productId}`);

        return res.data;
    } catch (error: any) {
        toast.error(error.message || error);
        console.log(error)
    }
}

export const addProductMediaData = async (businessId: string, productId: any, files: any) => {
    try {
        const formData = new FormData();
        files.forEach((file: any, i: number) => {
            formData.append("files", file?.file); // Make sure the key name 'files' matches the backend expectation
        });

        // Send the form data with multipart/form-data header
        const res:any = await post(`/product/addMedia?businessId=${businessId}&productId=${productId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return res.data;
    } catch (error: any) {
        toast.error(error.message || error);
        console.log(error)
    }
}

export const removeProductMediaData = async (businessId: string, productId: any, fileId: any) => {
    try {
        const res: any = await del(`/product/removeMedia?businessId=${businessId}&productId=${productId}&fileId=${fileId}`);

        return res.data;
    } catch (error: any) {
        toast.error(error.message || error);
        console.log(error)
    }
}

export const getProductBySearch = async (businessId: string, searchKey: any) => {
    try {
        const res: any = await get(`/product/search?businessId=${businessId}&searchKey=${searchKey}`);

        return res.data;
    } catch (error: any) {
        toast.error(error.message || error);
        console.log(error)
    }
}

export const toggleArchiveOrActiveProduct = async (businessId: any, productId: any, type: any, payload: any) => {
    try {
        const res: any = await get(`/product/toggle/archiveOrDisable?businessId=${businessId}&productId=${productId}&type=${type}&payload=${payload}`);

        return res?.data;
    } catch (error: any) {
        toast.error(error.message || error);
        console.log(error)
    }
}