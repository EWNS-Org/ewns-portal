import toast from "react-hot-toast";
import { del, get, post, put } from "./api-service"


export const createBusinessAddress = async (addressDetails: any, businessId: any) => {
    try {
        let body = {
            pincode: addressDetails.pincode,
            addressLine1: addressDetails.addressLine1,
            addressLine2: addressDetails.addressLine2,
            city: addressDetails.city,
            state: addressDetails.state,
            country: addressDetails.country,
            countryCode: addressDetails.countryCode,
            phoneNumber: addressDetails.phoneNumber,
            name: addressDetails.name,
            landmark: addressDetails.landmark,
            coords: {
                lat: addressDetails?.coords?.lat,
                lng: addressDetails?.coords?.lng
            }
        }
        const res: any = await post(`/address/business/add?businessId=${businessId}`, body);
        return res.data;
    } catch (error: any) {
        toast.error(error.message || error);
        console.log(error)
    }

}

export const updateBusinessAddress = async (addressDetails: any, businessId: any, addressId: any) => {
    try {
        let body = {
            pincode: addressDetails.pincode,
            addressLine1: addressDetails.addressLine1,
            addressLine2: addressDetails.addressLine2,
            city: addressDetails.city,
            state: addressDetails.state,
            country: addressDetails.country,
            countryCode: addressDetails.countryCode,
            phoneNumber: addressDetails.phoneNumber,
            name: addressDetails.name,
            landmark: addressDetails.landmark,
            coords: {
                lat: addressDetails?.coords?.lat,
                lng: addressDetails?.coords?.lng
            }
        }
        const res: any = await put(`/address/business/update?businessId=${businessId}&addressId=${addressId}`, body);
        return res.data;
    } catch (error: any) {
        toast.error(error.message || error);
        console.log(error)
    }

}

export const getAllBusinessAddresses = async (businessId: any) => {
    try {
        const res: any = await get(`/address/business/getAll?businessId=${businessId}`);
        return res.data;
    } catch (error: any) {
        toast.error(error.message || error);
        console.log(error)
    }
}

export const deleteBusinessAddress = async (businessId: any, addressId: any) => {
    try {
        const res: any = await del(`/address/business/delete?businessId=${businessId}&addressId=${addressId}`);
        return res.data;
    } catch (error: any) {
        toast.error(error.message || error);
        console.log(error)
    }
}

export const defaultBusinessAddress = async (businessId: any, addressId: any) => {
    try {
        const res: any = await get(`/address/business/default?businessId=${businessId}&addressId=${addressId}`);
        return res.data;
    } catch (error: any) {
        toast.error(error.message || error);
        console.log(error)
    }
}

