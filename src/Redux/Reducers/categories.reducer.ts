
import { GET_ALL_CATEGORIES, GET_CATEGORY_DETAILS } from '../Actions/Categories/category.action.type';

const initialState = {
    allCategories: null,
    categoryDetails: null,
    loading: false,
    error: null,
};

export const categoriesReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case GET_ALL_CATEGORIES:
            return { ...state, allCategories: action.payload };
        case GET_CATEGORY_DETAILS:
            return { ...state, categoryDetails: action.payload };
        default:
            return state;
    }
};