import toast from 'react-hot-toast';
import { get, post } from './api-service';

export const register = async (formData: any) => {
    try {
        const res: any = await post('/auth/register', formData);
        return res;
    } catch (error: any) {
        toast.error("Error Registration");
        console.error(error);
    }
};

export const loginUser = async (formData: any) => {
    try {
        const res: any = await post('/auth/login', formData);
        return res;
    } catch (error: any) {
        toast.error("Error Registration");
        console.error(error);
    }
};

export const verifyEmail = async (token: any) => {
    try {
        const res: any = await get('/auth/verify-email/' + token);
        return res;
    } catch (error: any) {
        toast.error("Error Registration");
        console.error(error);
    }
};

export const checkTokenIsValid = async (token: any, businessId: any) => {
    try {
        const res: any = await get(`/auth/check-token?token=${token}&businessId=${businessId}`);
        return res;
    } catch (error: any) {
        toast.error("Error Checking Token");
        console.error(error);
    }
};