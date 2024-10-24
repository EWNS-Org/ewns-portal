import toast from "react-hot-toast";
import { post, get, put, del } from "./api-service";



export const addTestimonialsData = async (businessId: string, payload: any) => {
    try {
        const res: any = await post(`/testimonial/create?businessId=${businessId}`, payload);

        return res.data;
    } catch (error: any) {
        toast.error(error.message || error);
        console.log(error)
    }
}


export const getAllTestimonialsData = async (businessId: string) => {
    try {
        const res: any = await get(`/testimonial/getAll?businessId=${businessId}`);

        return res.data;
    } catch (error: any) {
        toast.error(error.message || error);
        console.log(error)
    }
}

export const getTestimonialDetailsData = async (businessId: any, testimonialId: any) => {
    try {
        const res: any = await get(`/testimonial/get?businessId=${businessId}&testimonialId=${testimonialId}`);

        return res.data;
    } catch (error: any) {
        toast.error(error.message || error);
        console.log(error)
    }
}

export const updateTestimonialData = async (businessId: string, testimonialId: any, payload: any) => {
    try {
        const res: any = await put(`/testimonial/update?businessId=${businessId}&testimonialId=${testimonialId}`, {...payload});

        return res.data;
    } catch (error: any) {
        toast.error(error.message || error);
        console.log(error)
    }
}

export const deleteTestimonialData = async (businessId: string, testimonialId: any) => {
    try {
        const res: any = await del(`/testimonial/delete?businessId=${businessId}&testimonialId=${testimonialId}`);

        return res.data;
    } catch (error: any) {
        toast.error(error.message || error);
        console.log(error)
    }
}


export const toggleTestimonialData = async (businessId: string, testimonialId: any, isActive: boolean) => {
    try {
        const res: any = await get(`/testimonial/toggle?businessId=${businessId}&testimonialId=${testimonialId}&isActive=${isActive}`);

        return res.data;
    } catch (error: any) {
        toast.error(error.message || error);
        console.log(error)
    }
}


