import toast from "react-hot-toast";
import { GET_BLOG_DETAILS, GET_BLOGS, GET_SERVICE_DETAILS, GET_SERVICES } from "./blogs&services.actions.types";
import { addBlogMediaData, addServiceMediaData, createBlogData, createServiceData, deleteBlogData, deleteServiceData, getAllBlogsData, getAllServicesData, getBlogDetailsData, getPopularBlogsData, getPopularServicesData, getServiceDetailsData, removeFileFromBlogData, removeFileFromServiceData, toggleBlogData, toggleServiceData, updateBlogData, updateServiceData } from "../../../services/api/blogs&services";




export const getAllBlogs = (blogsData: any) => ({
    type: GET_BLOGS,
    payload: blogsData,
});

export const getBlogDetails = (blogsData: any) => ({
    type: GET_BLOG_DETAILS,
    payload: blogsData,
});

export const getAllServices = (servicesData: any) => ({
    type: GET_SERVICES,
    payload: servicesData,
});

export const getServiceDetails = (servicesData: any) => ({
    type: GET_SERVICE_DETAILS,
    payload: servicesData,
});


export const createBlogAction = (businessId: any, data: any) => async (dispatch: any) => {
    try{
        let appointmentConfig = await createBlogData(businessId, data);
        dispatch(getAllBlogs(appointmentConfig));
    }
    catch(err: any){
        toast.error("Error getting all blogs");
    }
}

export const getAllBlogsAction = (businessId: any) => async (dispatch: any) => {
    try{
        let appointmentConfig = await getAllBlogsData(businessId);
        dispatch(getAllBlogs(appointmentConfig));
    }
    catch(err: any){
        toast.error("Error getting all blogs");
    }
}

export const getBlogDetailsAction = (businessId: any, blogId: any) => async (dispatch: any) => {
    try{
        let appointmentConfig = await getBlogDetailsData(businessId, blogId);
        dispatch(getBlogDetails(appointmentConfig));
    }
    catch(err: any){
        toast.error("Error getting blog details");
    }
}

export const updateBlogAction = (businessId: any, blogId:any, payload: any) => async (dispatch: any) => {
    try{
        await updateBlogData(businessId, blogId, payload);
    }
    catch(err: any){
        toast.error("Error updating blog");
    }
}

export const deleteBlogAction = (businessId: any, blogId: any) => async (dispatch: any) => {
    try{
        await deleteBlogData(businessId, blogId);
    }
    catch(err: any){
        toast.error("Error Deleting blog");
    }
}

export const toggleBlogAction = (businessId: any, blogId: any, isActive: any) => async (dispatch: any) => {
    try{
        await toggleBlogData(businessId, blogId, isActive);
    }
    catch(err: any){
        toast.error("Error updating active status for blog");
    }
}

export const addBlogMediaAction = (businessId: any, blogId: any, files: any) => async (dispatch: any) => {
    try{
        await addBlogMediaData(businessId, blogId, files);
    }
    catch(err: any){
        toast.error("Error adding blog media");
    }
}

export const removeBlogMediaAction = (businessId: any, blogId: any, fileId: any) => async (dispatch: any) => {
    try{
        await removeFileFromBlogData(businessId, blogId, fileId);
    }
    catch(err: any){
        toast.error("Error removing blog media");
    }
}




export const createServiceAction = (businessId: any, data: any) => async (dispatch: any) => {
    try{
        let appointmentConfig = await createServiceData(businessId, data);
        dispatch(getAllServices(appointmentConfig));
    }
    catch(err: any){
        toast.error("Error getting all services");
    }
}

export const getAllServicesAction = (businessId: any) => async (dispatch: any) => {
    try{
        let appointmentConfig = await getAllServicesData(businessId);
        dispatch(getAllServices(appointmentConfig));
    }
    catch(err: any){
        toast.error("Error getting all services");
    }
}

export const getServiceDetailsAction = (businessId: any, serviceId: any) => async (dispatch: any) => {
    try{
        let appointmentConfig = await getServiceDetailsData(businessId, serviceId);
        dispatch(getServiceDetails(appointmentConfig));
    }
    catch(err: any){
        toast.error("Error getting service details");
    }
}

export const updateServiceAction = (businessId: any, serviceId:any, payload: any) => async (dispatch: any) => {
    try{
        await updateServiceData(businessId, serviceId, payload);
    }
    catch(err: any){
        toast.error("Error updating service");
    }
}

export const deleteServiceAction = (businessId: any, serviceId: any) => async (dispatch: any) => {
    try{
        await deleteServiceData(businessId, serviceId);
    }
    catch(err: any){
        toast.error("Error Deleting service");
    }
}

export const toggleServiceAction = (businessId: any, serviceId: any, isActive: any) => async (dispatch: any) => {
    try{
        await toggleServiceData(businessId, serviceId, isActive);
    }
    catch(err: any){
        toast.error("Error updating active status for service");
    }
}

export const addServiceMediaAction = (businessId: any, serviceId: any, files: any) => async (dispatch: any) => {
    try{
        await addServiceMediaData(businessId, serviceId, files);
    }
    catch(err: any){
        toast.error("Error adding service media");
    }
}

export const removeServiceMediaAction = (businessId: any, serviceId: any, fileId: any) => async (dispatch: any) => {
    try{
        await removeFileFromServiceData(businessId, serviceId, fileId);
    }
    catch(err: any){
        toast.error("Error removing service media");
    }
}

export const getPopularServicesAction = (businessId: any) => async (dispatch: any) => {
    try{
        await getPopularServicesData(businessId);
    }
    catch(err: any){
        toast.error("Error removing service media");
    }
}

export const getPopularBlogs = (businessId: any) => async (dispatch: any) => {
    try{
        await getPopularBlogsData(businessId);
    }
    catch(err: any){
        toast.error("Error removing service media");
    }
}