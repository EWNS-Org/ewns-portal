
import { GET_ALL_CATEGORIES, GET_CATEGORY_DETAILS } from '../Actions/Categories/category.action.type';
import { GET_ALL_TESTIMONIALS } from '../Actions/Testimonials/testimonial.action.type';

const initialState = {
    allTestimonials: [],
    loading: false,
    error: null,
};

export const testimonialsReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case GET_ALL_TESTIMONIALS:
            return { ...state, allTestimonials: action.payload };
        default:
            return state;
    }
};