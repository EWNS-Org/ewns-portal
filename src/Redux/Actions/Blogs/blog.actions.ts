import toast from 'react-hot-toast';
import { GET_ALL_BLOGS, GET_BLOG_DETAILS, BLOG_START_LOADING, BLOG_STOP_LOADING } from './blog.action.type';
import { addBlogData, deleteBlogData, getAllBlogsData, getBlogDetailsData, toggleBlogData, updateBlogData } from '../../../services/api/blogs.service';

export const setBlogStartLoading = () => ({ type: BLOG_START_LOADING });
export const setBlogStopLoading = () => ({ type: BLOG_STOP_LOADING });
export const getAllBlogsSuccess = (data: any) => ({ type: GET_ALL_BLOGS, payload: data });
export const getBlogDetailsSuccess = (data: any) => ({ type: GET_BLOG_DETAILS, payload: data });

export const getAllBlogsAction = (businessId: any) => async (dispatch: any) => {
    try {
        dispatch(setBlogStartLoading());
        const data = await getAllBlogsData(businessId);
        dispatch(getAllBlogsSuccess(data));
        dispatch(setBlogStopLoading());
    } catch (err: any) {
        toast.error('Error getting blogs');
    }
};

export const getBlogDetailsAction = (businessId: any, blogId: any) => async (dispatch: any) => {
    try {
        dispatch(setBlogStartLoading());
        const data = await getBlogDetailsData(businessId, blogId);
        dispatch(getBlogDetailsSuccess(data));
        dispatch(setBlogStopLoading());
        return data;
    } catch (err: any) {
        toast.error('Error getting blog details');
    }
};

export const addBlogAction = (businessId: any, payload: any) => async (dispatch: any) => {
    try {
        dispatch(setBlogStartLoading());
        await addBlogData(businessId, payload);
        dispatch(setBlogStopLoading());
    } catch (err: any) {
        toast.error('Error adding blog');
    }
};

export const updateBlogAction = (businessId: any, blogId: any, payload: any) => async (dispatch: any) => {
    try {
        dispatch(setBlogStartLoading());
        await updateBlogData(businessId, blogId, payload);
        dispatch(setBlogStopLoading());
    } catch (err: any) {
        toast.error('Error updating blog');
    }
};

export const deleteBlogAction = (businessId: any, blogId: any) => async (dispatch: any) => {
    try {
        dispatch(setBlogStartLoading());
        await deleteBlogData(businessId, blogId);
        dispatch(setBlogStopLoading());
    } catch (err: any) {
        toast.error('Error deleting blog');
    }
};

export const toggleBlogAction = (businessId: any, blogId: any, isActive: boolean) => async (dispatch: any) => {
    try {
        await toggleBlogData(businessId, blogId, isActive);
    } catch (err: any) {
        toast.error('Error toggling blog status');
    }
};
