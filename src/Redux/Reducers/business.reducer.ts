import {
    CREATE_BUSINESS_REQUEST,
    CREATE_BUSINESS_SUCCESS,
    CREATE_BUSINESS_FAILURE,
    GET_ALL_BUSINESSES_REQUEST,
    GET_ALL_BUSINESSES_SUCCESS,
    GET_ALL_BUSINESSES_FAILURE,
    GET_BUSINESS_DETAILS_REQUEST,
    GET_BUSINESS_DETAILS_SUCCESS,
    GET_BUSINESS_DETAILS_FAILURE,
    UPDATE_BUSINESS_PROFILE,
    GET_ALL_BUSINESS_ADDRESSES,
    GET_ALL_BUSINESS_LINKS,
    GET_ALL_BUSINESS_FAQS,
    GET_USER_DETAILS,
} from '../Actions/BusinessActions/business.action.types';

const initialState = {
    businesses: [],
    businessDetails: null,
    userDetails: null,
    businessAddresses: [],
    businessLinks: [],
    businessFAQs: [],
    loading: false,
    error: null,
};

export const businessReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case GET_ALL_BUSINESSES_REQUEST:
            return { ...state, businesses: state.businesses };
        case GET_ALL_BUSINESSES_SUCCESS:
            return { ...state, businesses: action.payload };
        case GET_ALL_BUSINESSES_FAILURE:
            return { ...state, businesses: [] };

        case GET_BUSINESS_DETAILS_REQUEST:
            return { ...state, businessDetails: state.businessDetails };
        case GET_BUSINESS_DETAILS_SUCCESS:
            return { ...state, businessDetails: action.payload };
        case GET_BUSINESS_DETAILS_FAILURE:
            return { ...state, businessDetails: null };
        case GET_ALL_BUSINESS_ADDRESSES:
            return { ...state, businessAddresses: action.payload };
        case GET_ALL_BUSINESS_LINKS:
            return { ...state, businessLinks: action.payload };
        case GET_ALL_BUSINESS_FAQS:
            return { ...state, businessFAQs: action.payload };
        case GET_USER_DETAILS:
            return { ...state, userDetails: action.payload };
        default:
            return state;
    }
};