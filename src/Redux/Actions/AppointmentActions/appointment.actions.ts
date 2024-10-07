import toast from "react-hot-toast";
import { getAllAppointmentCountsData, getAllAppointmentsData, getAppointmentsConfigurationData, updateAppointmentsConfigurationData, updateAppointmentStatusData } from "../../../services/api/appointment.service";
import { APPOINTMENT_LOADING, APPOINTMENT_STOP_LOADING, GET_ALL_APPOINTMENTS, GET_ALL_APPOINTMENTS_COUNTS, GET_APPOINTMENT_CONFIGURATION, UPDATE_APPOINTMENT_STATUS } from "./appointment.action.types";


export const getAppointmentsConfiguration = (appointmentsconfig: any) => ({
    type: GET_APPOINTMENT_CONFIGURATION,
    payload: appointmentsconfig,
});

export const getAppointmentsCounts = (appointmentscounts: any) => ({
    type: GET_ALL_APPOINTMENTS_COUNTS,
    payload: appointmentscounts,
});

export const setAppointmentsConfigurationLoading = () => ({
    type: APPOINTMENT_LOADING
});

export const setAppointmentsConfigurationStopLoading = () => ({
    type: APPOINTMENT_STOP_LOADING
});

export const getAppointments = (appointmentsdata: any) => ({
    type: GET_ALL_APPOINTMENTS,
    payload: appointmentsdata,
});


export const getAppointmentConfigAction = (businessId: any) => async (dispatch: any) => {
    try{
        dispatch(setAppointmentsConfigurationLoading);
        let appointmentConfig = await getAppointmentsConfigurationData(businessId);
        dispatch(getAppointmentsConfiguration(appointmentConfig));
        dispatch(setAppointmentsConfigurationStopLoading);
    }
    catch(err: any){
        toast.error("Error getting appointments");
    }
}

export const updateAppointmentConfigAction = (businessId: any, payload: any) => async (dispatch: any) => {
    try{
        dispatch(setAppointmentsConfigurationLoading);
        let appointmentConfig = await updateAppointmentsConfigurationData(businessId, payload);
        dispatch(getAppointmentsConfiguration(appointmentConfig));
        dispatch(setAppointmentsConfigurationStopLoading);
    }
    catch(err: any){
        toast.error("Error updating appointments");
    }
}


export const getAllAppointmentsAction = (businessId: any, filter: any) => async (dispatch: any) => {
    try{
        dispatch(setAppointmentsConfigurationLoading);
        let appointmentConfig = await getAllAppointmentsData(businessId, filter);
        dispatch(getAppointments(appointmentConfig));
        dispatch(setAppointmentsConfigurationStopLoading);
    }
    catch(err: any){
        toast.error("Error updating appointments");
    }
}


export const updateAppointmentStatusAction = (businessId: any, status: any, appointmentId: any) => async (dispatch: any) => {
    try{
        dispatch(setAppointmentsConfigurationLoading);
        let appointmentConfig = await updateAppointmentStatusData(businessId, status, appointmentId);
        dispatch(getAppointmentsConfiguration(appointmentConfig));
        dispatch(setAppointmentsConfigurationStopLoading);
    }
    catch(err: any){
        toast.error("Error updating appointments");
    }
}

export const getAllAppointmentCountsAction = (businessId: any) => async (dispatch: any) => {
    try{
        dispatch(setAppointmentsConfigurationLoading);
        let appointmentConfig = await getAllAppointmentCountsData(businessId);
        dispatch(getAppointmentsCounts(appointmentConfig));
        dispatch(setAppointmentsConfigurationStopLoading);
    }
    catch(err: any){
        toast.error("Error updating appointments");
    }
}