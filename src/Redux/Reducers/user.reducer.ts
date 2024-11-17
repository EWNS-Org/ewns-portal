
import { GET_USER_DETAILS } from '../Actions/BusinessActions/business.action.types';
import { GET_ALL_CATEGORIES, GET_CATEGORY_DETAILS } from '../Actions/Categories/category.action.type';
import { GET_ALL_TESTIMONIALS } from '../Actions/Testimonials/testimonial.action.type';

const initialState = {
    userDetails: null
};

export const userReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case GET_USER_DETAILS:
            return { ...state, userDetails: action.payload };
        default:
            return state;
    }
};