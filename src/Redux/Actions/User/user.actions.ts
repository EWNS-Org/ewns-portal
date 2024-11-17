import toast from "react-hot-toast";
import { GET_USER_DETAILS } from "./user.action.type";
import { getUserDetailsData, updateUserDetailsData } from "../../../services/api/business.service";

export const getUserDetails = (testimonialData: any) => ({
    type: GET_USER_DETAILS,
    payload: testimonialData
});


export const getUserDetailsAction = () => async (dispatch: any) => {
    try{
        let catData = await getUserDetailsData();
        dispatch(getUserDetails(catData));
    }
    catch(err: any){
        toast.error("Error getting user data");
    }
}

export const updateUserDetailsAction = (payload: any) => async (dispatch: any) => {
    try{
        let catData = await updateUserDetailsData(payload);
    }
    catch(err: any){
        toast.error("Error updating user data");
    }
}