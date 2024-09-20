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
} from '../Actions/BusinessActions/business.action.types';

const initialState = {
    businesses: [],
    businessDetails: null,
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

        default:
            return state;
    }
};