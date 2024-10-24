import toast from "react-hot-toast";
import { TESTIMONIAL_START_LOADING, TESTIMONIAL_STOP_LOADING, GET_ALL_TESTIMONIALS, GET_TESTIMONIAL_DETAILS } from "./testimonial.action.type";
import { addTestimonialsData,  deleteTestimonialData, getAllTestimonialsData, getTestimonialDetailsData, toggleTestimonialData, updateTestimonialData } from "../../../services/api/testimonials.service";

export const setTestimonialStartLoading = () => ({
    type: TESTIMONIAL_START_LOADING
});

export const setTestimonialStopLoading = () => ({
    type: TESTIMONIAL_STOP_LOADING
});

export const getAllTestimonials = (categoriesData: any) => ({
    type: GET_ALL_TESTIMONIALS,
    payload: categoriesData
});

export const getTestimonialDetails = (testimonialData: any) => ({
    type: GET_TESTIMONIAL_DETAILS,
    payload: testimonialData
});


export const getAllTestimonialsAction = (businessId: any) => async (dispatch: any) => {
    try{
        dispatch(setTestimonialStartLoading);
        let catData = await getAllTestimonialsData(businessId);
        dispatch(getAllTestimonials(catData));
        dispatch(setTestimonialStopLoading);
    }
    catch(err: any){
        toast.error("Error getting all categories");
    }
}

export const getTestimonialDetailsAction = (businessId: any, testimonialId: any) => async (dispatch: any) => {
    try{
        dispatch(setTestimonialStartLoading);
        let catData = await getTestimonialDetailsData(businessId, testimonialId);
        dispatch(setTestimonialStopLoading);
        return catData;
    }
    catch(err: any){
        toast.error("Error getting testimonial details");
    }
}


export const addTestimonialAction = (businessId: any, data: any) => async (dispatch: any) => {
    try{
        dispatch(setTestimonialStartLoading);
        let catData = await addTestimonialsData(businessId, data);
        dispatch(setTestimonialStopLoading);
    }
    catch(err: any){
        toast.error("Error adding testimonial details");
    }
}

export const updateTestimonialAction = (businessId: any, testimonialId: any, payload: any) => async (dispatch: any) => {
    try{
        dispatch(setTestimonialStartLoading);
        let catData = await updateTestimonialData(businessId, testimonialId, payload);
        dispatch(getAllTestimonials(catData));
        dispatch(setTestimonialStopLoading);
    }
    catch(err: any){
        toast.error("Error updating testimonial details");
    }
}

export const deleteTestimonialAction = (businessId: any, testimonialId: any) => async (dispatch: any) => {
    try{
        dispatch(setTestimonialStartLoading);
        let catData = await deleteTestimonialData(businessId, testimonialId);
        dispatch(getAllTestimonials(catData));
        dispatch(setTestimonialStopLoading);
    }
    catch(err: any){
        toast.error("Error deleting testimonial details");
    }
}


export const toggleTestimonialAction = (businessId: any, testimonialId: any, isActive: boolean) => async (dispatch: any) => {
    try{
        dispatch(setTestimonialStartLoading);
        let catData = await toggleTestimonialData(businessId, testimonialId, isActive);
        dispatch(getAllTestimonials(catData));
        dispatch(setTestimonialStopLoading);
    }
    catch(err: any){
        toast.error("Error updating testimonial details");
    }
}



