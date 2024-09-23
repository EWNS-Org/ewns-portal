import { create } from 'domain';
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
    CREATE_BUSINESS_ADDRESS,
    UPDATE_BUSINESS_ADDRESS,
    GET_ALL_BUSINESS_ADDRESSES,
    GET_ALL_BUSINESS_LINKS,

} from './business.action.types';
import { createBusiness, createBusinessLink, deleteBusinessLink, getAllBusinessLinks, getAllBusinesses, getBusinessDetails, updateBusiness, updateBusinessLink, uploadBusinessImages } from '../../../services/api/business.service';
import toast from 'react-hot-toast';
import { createBusinessAddress, defaultBusinessAddress, deleteBusinessAddress, getAllBusinessAddresses, updateBusinessAddress } from '../../../services/api/address.service';

// Action creators for fetching businesses
export const getAllBusinessesRequest = () => ({
    type: GET_ALL_BUSINESSES_REQUEST,
});

export const getAllBusinessesSuccess = (businesses: any) => ({
    type: GET_ALL_BUSINESSES_SUCCESS,
    payload: businesses,
});

export const getAllBusinessesFailure = (error: any) => ({
    type: GET_ALL_BUSINESSES_FAILURE,
    payload: error,
});

// Action creators for business details
export const getBusinessDetailsRequest = (id: any) => ({
    type: GET_BUSINESS_DETAILS_REQUEST,
    payload: id,
});

export const getBusinessDetailsSuccess = (details: any) => ({
    type: GET_BUSINESS_DETAILS_SUCCESS,
    payload: details,
});

export const getBusinessDetailsFailure = (error: any) => ({
    type: GET_BUSINESS_DETAILS_FAILURE,
    payload: error,
});

export const createBusinessRequest = (business: any) => ({
    type: CREATE_BUSINESS_REQUEST,
    payload: business,
});

export const createBusinessSuccess = (newBusiness: any) => ({
    type: CREATE_BUSINESS_SUCCESS,
    payload: newBusiness,
});

export const createBusinessFailure = (error: any) => ({
    type: CREATE_BUSINESS_FAILURE,
    payload: error,
});

export const getAllBusinessAddressesRequest = (addresses: any) => ({
    type: GET_ALL_BUSINESS_ADDRESSES,
    payload: addresses,
});


export const getAllBusinessLinksRequest = (links: any) => ({
    type: GET_ALL_BUSINESS_LINKS,
    payload: links,
});


// Thunk to fetch all businesses
export const getAllBusinessesAction = () => async (dispatch: any) => {
    try {
        dispatch(getAllBusinessesRequest());
        const response = await getAllBusinesses();
        dispatch(getAllBusinessesSuccess(response));
    } catch (error: any) {
        dispatch(getAllBusinessesFailure(error.message || 'Failed to fetch businesses'));
    }
};

// Thunk to create a new business
export const createBusinessAction = (businessData: any) => async (dispatch: any) => {
    try {
        dispatch(createBusinessRequest(businessData));
        const response = await createBusiness(businessData);
        dispatch(createBusinessSuccess(response));
    } catch (error: any) {
        dispatch(createBusinessFailure(error.message || 'Failed to create business'));
    }
};

export const getBusinessDetailsAction = (businessId: any) => async (dispatch: any) => {
    try {
        dispatch(getBusinessDetailsRequest(businessId));
        const response = await getBusinessDetails(businessId);
        dispatch(getBusinessDetailsSuccess(response));

    } catch (error: any) {
        dispatch(getBusinessDetailsFailure(error.message || 'Failed to create business'));
    }
};

export const updateBusinessProfileAction = (businessDetails: any, businessId: any) => async (dispatch: any) => {
    try {
        dispatch(createBusinessRequest(businessDetails));
        const response = await updateBusiness(businessDetails, businessId);
        dispatch(createBusinessSuccess(response));

    } catch (error: any) {
        dispatch(createBusinessFailure(error.message || 'Failed to create business'));
    }
}

export const uploadBusinessImagesAction = (businessId: any, bodyData: any) => async (dispatch: any) => {
    try {
        const response = await uploadBusinessImages(businessId, bodyData);
        toast.success(response.message);

    } catch (error: any) {
        dispatch(createBusinessFailure(error.message || 'Failed to create business'));
    }
}

export const createBusinessAddressAction = (addressDetails: any, businessId: any) => async (dispatch: any) => {
    try {
        const response = await createBusinessAddress(addressDetails, businessId);
        dispatch(createBusinessSuccess(response));
    } catch (error: any) {
        dispatch(createBusinessFailure(error.message || 'Failed to create business address'));
    }
};

export const updateBusinessAddressAction = (addressDetails: any, businessId: any, addressId: any) => async (dispatch: any) => {
    try {
        const response = await updateBusinessAddress(addressDetails, businessId, addressId);
        dispatch(createBusinessSuccess(response));
    } catch (error: any) {
        dispatch(createBusinessFailure(error.message || 'Failed to update business address'));
    }
};

export const getAllBusinessAddressesAction = (businessId: any) => async (dispatch: any) => {
    try {
        const response = await getAllBusinessAddresses(businessId);
        dispatch(getAllBusinessAddressesRequest(response));
    } catch (error: any) {
        dispatch(createBusinessFailure(error.message || 'Failed to get business addresses'));
    }
};

export const deleteBusinessAddressAction = (businessId: any, addressId: any) => async (dispatch: any) => {
    try {
        const response = await deleteBusinessAddress(businessId, addressId);
        dispatch(getAllBusinessAddressesRequest(response));
    } catch (error: any) {
        dispatch(createBusinessSuccess(error.message || 'Failed to delete business address'));
    }
};

export const makeBusinessAddressDefaultAction = (businessId: any, addressId: any) => async (dispatch: any) => {
    try {
        const response = await defaultBusinessAddress(businessId, addressId);
        dispatch(getAllBusinessAddressesRequest(response));
    } catch (error: any) {
        dispatch(createBusinessSuccess(error.message || 'Failed to default business address'));
    }
};

export const createBusinessLinkAction = (linkData: any, businessId: any) => async (dispatch: any) => {
    try {
        const response = await createBusinessLink(linkData, businessId);
        dispatch(createBusinessSuccess(response));
    } catch (error: any) {
        dispatch(createBusinessFailure(error.message || 'Failed to create business address'));
    }
};

export const updateBusinessLinkAction = (linkData: any, businessId: any, linkId: any) => async (dispatch: any) => {
    try {
        const response = await updateBusinessLink(linkData, businessId, linkId);
        dispatch(createBusinessSuccess(response));
    } catch (error: any) {
        dispatch(createBusinessFailure(error.message || 'Failed to update business address'));
    }
};

export const getAllBusinessLinksAction = (businessId: any) => async (dispatch: any) => {
    try {
        const response = await getAllBusinessLinks(businessId);
        dispatch(getAllBusinessLinksRequest(response));
    } catch (error: any) {
        dispatch(createBusinessFailure(error.message || 'Failed to get business addresses'));
    }
};

export const deleteBusinessLinkAction = (businessId: any, linkId: any) => async (dispatch: any) => {
    try {
        const response = await deleteBusinessLink(businessId, linkId);
        dispatch(getAllBusinessAddressesRequest(response));
    } catch (error: any) {
        dispatch(createBusinessSuccess(error.message || 'Failed to delete business address'));
    }
};