
import { GET_BLOG_DETAILS, GET_BLOGS, GET_SERVICE_DETAILS, GET_SERVICES } from '../Actions/Blogs&Services/blogs&services.actions.types';


const initialState = {
    allBlogs: [],
    allServices: [],
    blogDetails: null,
    serviceDetails: null
};

export const blogsAndServicesReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case GET_BLOGS:
            return { ...state, allBlogs: action.payload };
        case GET_BLOG_DETAILS:
            return { ...state, blogDetails: action.payload };
        case GET_SERVICES:
                return { ...state, allServices: action.payload };
        case GET_SERVICE_DETAILS:
            return { ...state, serviceDetails: action.payload };        
        default:
            return state;
    }
};