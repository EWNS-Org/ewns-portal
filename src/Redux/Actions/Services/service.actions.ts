import toast from 'react-hot-toast';
import { GET_ALL_SERVICES, GET_SERVICE_DETAILS, SERVICE_START_LOADING, SERVICE_STOP_LOADING } from './service.action.type';
import { addServiceData, deleteServiceData, getAllServicesData, getServiceDetailsData, toggleServiceData, updateServiceData } from '../../../services/api/services.service';

export const setServiceStartLoading = () => ({ type: SERVICE_START_LOADING });
export const setServiceStopLoading = () => ({ type: SERVICE_STOP_LOADING });
export const getAllServicesSuccess = (data: any) => ({ type: GET_ALL_SERVICES, payload: data });
export const getServiceDetailsSuccess = (data: any) => ({ type: GET_SERVICE_DETAILS, payload: data });

export const getAllServicesAction = (businessId: any) => async (dispatch: any) => {
    try {
        dispatch(setServiceStartLoading());
        const data = await getAllServicesData(businessId);
        dispatch(getAllServicesSuccess(data));
        dispatch(setServiceStopLoading());
    } catch (err: any) {
        toast.error('Error getting services');
    }
};

export const getServiceDetailsAction = (businessId: any, serviceId: any) => async (dispatch: any) => {
    try {
        dispatch(setServiceStartLoading());
        const data = await getServiceDetailsData(businessId, serviceId);
        dispatch(getServiceDetailsSuccess(data));
        dispatch(setServiceStopLoading());
        return data;
    } catch (err: any) {
        toast.error('Error getting service details');
    }
};

export const addServiceAction = (businessId: any, payload: any) => async (dispatch: any) => {
    try {
        dispatch(setServiceStartLoading());
        await addServiceData(businessId, payload);
        dispatch(setServiceStopLoading());
    } catch (err: any) {
        toast.error('Error adding service');
    }
};

export const updateServiceAction = (businessId: any, serviceId: any, payload: any) => async (dispatch: any) => {
    try {
        dispatch(setServiceStartLoading());
        await updateServiceData(businessId, serviceId, payload);
        dispatch(setServiceStopLoading());
    } catch (err: any) {
        toast.error('Error updating service');
    }
};

export const deleteServiceAction = (businessId: any, serviceId: any) => async (dispatch: any) => {
    try {
        dispatch(setServiceStartLoading());
        await deleteServiceData(businessId, serviceId);
        dispatch(setServiceStopLoading());
    } catch (err: any) {
        toast.error('Error deleting service');
    }
};

export const toggleServiceAction = (businessId: any, serviceId: any, isActive: boolean) => async (dispatch: any) => {
    try {
        await toggleServiceData(businessId, serviceId, isActive);
    } catch (err: any) {
        toast.error('Error toggling service status');
    }
};
