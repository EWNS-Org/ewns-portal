
import { GET_ALL_CATEGORIES, GET_CATEGORY_DETAILS } from '../Actions/Categories/category.action.type';
import { GET_ALL_PRODUCTS, GET_PRODUCT_DETAILS } from '../Actions/Products/product.action.type';

const initialState = {
    allProducts: null,
    productDetails: null,
    loading: false,
    error: null,
};

export const productsReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case GET_ALL_PRODUCTS:
            return { ...state, allProducts: action.payload };
        case GET_PRODUCT_DETAILS:
            console.log(action);
            return { ...state, productDetails: action.payload };
        default:
            return state;
    }
};