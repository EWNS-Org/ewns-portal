import toast from "react-hot-toast";
import { get } from "./api-service";


export const selectThemeData = async (businessId: string, themeId: any) => {
    try {
        const res: any = await get(`/business/setTheme?businessId=${businessId}&themeId=${themeId}`);

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