import toast from "react-hot-toast";
import { get, put } from "./api-service";


export const selectThemeData = async (businessId: string, themeId: any) => {
    try {
        const res: any = await get(`/theme/select?businessId=${businessId}&themeId=${themeId}`);

        return res.data;
    } catch (error: any) {
        toast.error(error.message || error);
        console.log(error)
    }
}


export const getAllThemesData = async (businessId: string) => {
    try {
        const res: any = await get(`/theme/getAll?businessId=${businessId}`);

        return res.data;
    } catch (error: any) {
        toast.error(error.message || error);
        console.log(error)
    }
}

export const getNimbusConfigData = async (businessId: string) => {
    try {
        const res: any = await get(`/theme/nimbus-config/get?businessId=${businessId}`);
        return res.data;
    } catch (error: any) {
        toast.error(error.message || error);
        console.log(error);
    }
}

export const updateNimbusConfigData = async (businessId: string, data: any) => {
    try {
        const res: any = await put(`/theme/nimbus-config/update?businessId=${businessId}`, data);
        return res.data;
    } catch (error: any) {
        toast.error(error.message || error);
        console.log(error);
    }
}
