import { GET_ALL_SERVICES, GET_SERVICE_DETAILS } from '../Actions/Services/service.action.type';

const initialState = {
    allServices: null,
    serviceDetails: null,
    loading: false,
    error: null,
};

export const servicesReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case GET_ALL_SERVICES:
            return { ...state, allServices: action.payload };
        case GET_SERVICE_DETAILS:
            return { ...state, serviceDetails: action.payload };
        default:
            return state;
    }
};
