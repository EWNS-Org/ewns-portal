import toast from 'react-hot-toast';
import { get, post } from './api-service';

export const register = async (formData: any) => {
    try {
        const res: any = await post('/auth/register', formData);
        return res.data
    } catch (error: any) {
        toast.error("Error Registration");
        console.error(error);
    }
};
