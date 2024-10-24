import toast from "react-hot-toast";
import { THEME_START_LOADING, THEME_STOP_LOADING, GET_ALL_THEMES, GET_THEME_DETAILS } from "./themes.action.type";
import { selectThemeData, getAllThemesData } from "../../../services/api/themes.service";

export const setThemeStartLoading = () => ({
    type: THEME_START_LOADING
});

export const setThemeStopLoading = () => ({
    type: THEME_STOP_LOADING
});

export const getAllThemes = (themesData: any) => ({
    type: GET_ALL_THEMES,
    payload: themesData
});

export const getThemeDetails = (themeData: any) => ({
    type: GET_THEME_DETAILS,
    payload: themeData
});


export const getAllThemesAction = (businessId: any) => async (dispatch: any) => {
    try{
        dispatch(setThemeStartLoading);
        let catData = await getAllThemesData(businessId);
        dispatch(getAllThemes(catData));
        dispatch(setThemeStopLoading);
    }
    catch(err: any){
        toast.error("Error getting all themes");
    }
}

// export const getThemeDetailsAction = (businessId: any, themeId: any) => async (dispatch: any) => {
//     try{
//         dispatch(setThemeStartLoading);
//         let catData = await getThemeDetailsData(businessId, themeId);
//         dispatch(setThemeStopLoading);
//         return catData;
//     }
//     catch(err: any){
//         toast.error("Error getting theme details");
//     }
// }

export const selectThemeAction = (businessId: any, themeId: any) => async (dispatch: any) => {
    try{
        dispatch(setThemeStartLoading);
        let catData = await selectThemeData(businessId, themeId);
        dispatch(setThemeStopLoading);
        return catData;
    }
    catch(err: any){
        toast.error("Error getting theme details");
    }
}




// export const addThemeAction = (businessId: any, data: any) => async (dispatch: any) => {
//     try{
//         dispatch(setThemeStartLoading);
//         let catData = await addThemesData(businessId, data);
//         dispatch(setThemeStopLoading);
//     }
//     catch(err: any){
//         toast.error("Error adding theme details");
//     }
// }

// export const updateThemeAction = (businessId: any, themeId: any, payload: any) => async (dispatch: any) => {
//     try{
//         dispatch(setThemeStartLoading);
//         let catData = await updateThemeData(businessId, themeId, payload);
//         dispatch(getAllThemes(catData));
//         dispatch(setThemeStopLoading);
//     }
//     catch(err: any){
//         toast.error("Error updating theme details");
//     }
// }

// export const deleteThemeAction = (businessId: any, themeId: any) => async (dispatch: any) => {
//     try{
//         dispatch(setThemeStartLoading);
//         let catData = await deleteThemeData(businessId, themeId);
//         dispatch(getAllThemes(catData));
//         dispatch(setThemeStopLoading);
//     }
//     catch(err: any){
//         toast.error("Error deleting theme details");
//     }
// }

// export const addSubThemeAction = (businessId: any, themeId: any, parentThemeId: any, payload: any) => async (dispatch: any) => {
//     try{
//         dispatch(setThemeStartLoading);
//         let catData = await addSubThemeData(businessId, themeId, parentThemeId, payload);
//         dispatch(getAllThemes(catData));
//         dispatch(setThemeStopLoading);
//     }
//     catch(err: any){
//         toast.error("Error adding sub theme details");
//     }
// }

// export const updateSubThemeDetailsAction = (businessId: any, themeId: any, subThemeId: any, payload: any) => async (dispatch: any) => {
//     try{
//         dispatch(setThemeStartLoading);
//         let catData = await updateSubThemeData(businessId, themeId, subThemeId, payload);
//         dispatch(getAllThemes(catData));
//         dispatch(setThemeStopLoading);
//     }
//     catch(err: any){
//         toast.error("Error updating sub theme details");
//     }
// }

// export const deleteSubThemeAction = (businessId: any, themeId: any, subThemeId: any) => async (dispatch: any) => {
//     try{
//         dispatch(setThemeStartLoading);
//         let catData = await deleteSubThemeData(businessId, themeId, subThemeId);
//         dispatch(getAllThemes(catData));
//         dispatch(setThemeStopLoading);
//     }
//     catch(err: any){
//         toast.error("Error deleting sub theme details");
//     }
// }

// export const getParentThemesAction = (businessId: any, subThemeId: any) => async (dispatch: any) => {
//     try{
//         dispatch(setThemeStartLoading);
//         let catData = await getParentThemes(businessId, subThemeId);
//         return catData;
//     }
//     catch(err: any){
//         toast.error("Error deleting sub theme details");
//     }
// }


