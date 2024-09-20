import toast from 'react-hot-toast';
import { get, post } from './api-service';

export const fetchPincodeDetails = async (pincode: string) => {
    try {
        const data: any = await get('/address/get-pincode-details?pincode=' + pincode);
        return data.data
    } catch (error: any) {
        toast.error(error.message || error);
        console.error(error);
    }
};
