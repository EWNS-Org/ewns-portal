import toast from "react-hot-toast";
import { get, put } from "./api-service";




export const getAppointmentsConfigurationData = async (businessId: any) => {
    try {
        const res: any = await get(`/appointment/config/get?businessId=${businessId}`);

        return res.data;
    }
    catch (error: any) {
        toast.error(error.message || error);
        console.log(error)
    }
}

export const updateAppointmentsConfigurationData = async (businessId: any, payload: any) => {
    try {
        const body = {
            slotSizeInMinutes: payload?.slotSizeInMinutes,
            weeklySlots: payload?.weeklySlots,
            isSameAsBizHours: payload?.isSameAsBizHours,
            gapBetweenSlotsInMinutes: payload?.gapBetweenSlotsInMinutes
        };
        const res: any = await put(`/appointment/config/update?businessId=${businessId}`, body);

        return res.data;
    }
    catch (error: any) {
        toast.error(error.message || error);
        console.log(error)
    }
}

export const getAllAppointmentsData = async (businessId: any, filter: any) => {
    try {
        const res: any = await get(`/appointment/get?businessId=${businessId}&filter=${filter}`);

        return res.data;
    }
    catch (error: any) {
        toast.error(error.message || error);
        console.log(error)
    }
}


export const updateAppointmentStatusData = async (businessId: any, status: any, appointmentId: any) => {
    try {
        const res: any = await get(`/appointment/update/status?businessId=${businessId}&status=${status}&appointmentId=${appointmentId}`);

        return res.data;
    }
    catch (error: any) {
        toast.error(error.message || error);
        console.log(error)
    }
}

export const getAllAppointmentCountsData = async (businessId: any) => {
    try {
        const res: any = await get(`/appointment/get/count?businessId=${businessId}`);

        return res.data;
    }
    catch (error: any) {
        toast.error(error.message || error);
        console.log(error)
    }
}