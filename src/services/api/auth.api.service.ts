import toast from 'react-hot-toast';
import { get, post } from './api-service';

export const register = async (formData: any) => {
    try {
        const res: any = await post('/auth/register', formData);
        return res;
    } catch (error: any) {
        console.error(error);
    }
};

export const loginUser = async (formData: any) => {
    try {
        const res: any = await post('/auth/login', formData);
        return res;
    } catch (error: any) {
        console.error(error);
    }
};

export const verifyEmail = async (token: any) => {
    try {
        const res: any = await get('/auth/verify-email/' + token);
        return res;
    } catch (error: any) {
        console.error(error);
    }
};

export const forgotPassword = async (email: string) => {
    try {
        const res: any = await post('/auth/forgot-password', { email });
        return res;
    } catch (error: any) {
        toast.error("Error sending reset email");
        console.error(error);
    }
};

export const validateResetToken = async (token: string) => {
    try {
        const res: any = await get('/auth/validate-reset-token/' + token);
        return res;
    } catch (error: any) {
        return null;
    }
};

export const resetPassword = async (token: string, newPassword: string) => {
    try {
        const res: any = await post('/auth/reset-password', { token, newPassword });
        return res;
    } catch (error: any) {
        toast.error("Error resetting password");
        console.error(error);
    }
};