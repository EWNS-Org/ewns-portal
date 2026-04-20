import { GET_ALL_BLOGS, GET_BLOG_DETAILS } from '../Actions/Blogs/blog.action.type';

const initialState = {
    allBlogs: null,
    blogDetails: null,
    loading: false,
    error: null,
};

export const blogsReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case GET_ALL_BLOGS:
            return { ...state, allBlogs: action.payload };
        case GET_BLOG_DETAILS:
            return { ...state, blogDetails: action.payload };
        default:
            return state;
    }
};
