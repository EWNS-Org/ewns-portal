import toast from "react-hot-toast";
import { get, post, put } from "./api-service"


export const getAllBusinesses = async () => {
    try {
        console.log("Call Business");

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