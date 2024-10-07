import toast from "react-hot-toast";
import { CATEGORY_START_LOADING, CATEGORY_STOP_LOADING, GET_ALL_CATEGORIES, GET_CATEGORY_DETAILS } from "./category.action.type";
import { addCategoriesData, addSubCategoryData, deleteCategoryData, deleteSubCategoryData, getAllCategoriesData, getCategoryDetailsData, getSubCategoryDetailsData, updateCategoryData, updateSubCategoryData } from "../../../services/api/categories.service";

export const setCategoryStartLoading = () => ({
    type: CATEGORY_START_LOADING
});

export const setCategoryStopLoading = () => ({
    type: CATEGORY_STOP_LOADING
});

export const getAllCategories = (categoriesData: any) => ({
    type: GET_ALL_CATEGORIES,
    payload: categoriesData
});

export const getCategoryDetails = (categoryData: any) => ({
    type: GET_CATEGORY_DETAILS,
    payload: categoryData
});


export const getAllCategoriesAction = (businessId: any) => async (dispatch: any) => {
    try{
        dispatch(setCategoryStartLoading);
        let catData = await getAllCategoriesData(businessId);
        dispatch(getAllCategories(catData));
        dispatch(setCategoryStopLoading);
    }
    catch(err: any){
        toast.error("Error getting all categories");
    }
}

export const getCategoryDetailsAction = (businessId: any, categoryId: any) => async (dispatch: any) => {
    try{
        dispatch(setCategoryStartLoading);
        let catData = await getCategoryDetailsData(businessId, categoryId);
        dispatch(setCategoryStopLoading);
        return catData;
    }
    catch(err: any){
        toast.error("Error getting category details");
    }
}

export const getSubCategoryDetailsAction = (businessId: any, categoryId: any, subCategoryId: any) => async (dispatch: any) => {
    try{
        dispatch(setCategoryStartLoading);
        let catData = await getSubCategoryDetailsData(businessId, categoryId, subCategoryId);
        dispatch(setCategoryStopLoading);
        return catData;
    }
    catch(err: any){
        toast.error("Error getting category details");
    }
}

export const addCategoryAction = (businessId: any, data: any) => async (dispatch: any) => {
    try{
        dispatch(setCategoryStartLoading);
        let catData = await addCategoriesData(businessId, data);
        dispatch(setCategoryStopLoading);
    }
    catch(err: any){
        toast.error("Error adding category details");
    }
}

export const updateCategoryAction = (businessId: any, categoryId: any, payload: any) => async (dispatch: any) => {
    try{
        dispatch(setCategoryStartLoading);
        let catData = await updateCategoryData(businessId, categoryId, payload);
        dispatch(getAllCategories(catData));
        dispatch(setCategoryStopLoading);
    }
    catch(err: any){
        toast.error("Error updating category details");
    }
}

export const deleteCategoryAction = (businessId: any, categoryId: any) => async (dispatch: any) => {
    try{
        dispatch(setCategoryStartLoading);
        let catData = await deleteCategoryData(businessId, categoryId);
        dispatch(getAllCategories(catData));
        dispatch(setCategoryStopLoading);
    }
    catch(err: any){
        toast.error("Error deleting category details");
    }
}

export const addSubCategoryAction = (businessId: any, categoryId: any, parentCategoryId: any, payload: any) => async (dispatch: any) => {
    try{
        dispatch(setCategoryStartLoading);
        let catData = await addSubCategoryData(businessId, categoryId, parentCategoryId, payload);
        dispatch(getAllCategories(catData));
        dispatch(setCategoryStopLoading);
    }
    catch(err: any){
        toast.error("Error adding sub category details");
    }
}

export const updateSubCategoryDetailsAction = (businessId: any, categoryId: any, subCategoryId: any, payload: any) => async (dispatch: any) => {
    try{
        dispatch(setCategoryStartLoading);
        let catData = await updateSubCategoryData(businessId, categoryId, subCategoryId, payload);
        dispatch(getAllCategories(catData));
        dispatch(setCategoryStopLoading);
    }
    catch(err: any){
        toast.error("Error updating sub category details");
    }
}

export const deleteSubCategoryAction = (businessId: any, categoryId: any, subCategoryId: any) => async (dispatch: any) => {
    try{
        dispatch(setCategoryStartLoading);
        let catData = await deleteSubCategoryData(businessId, categoryId, subCategoryId);
        dispatch(getAllCategories(catData));
        dispatch(setCategoryStopLoading);
    }
    catch(err: any){
        toast.error("Error deleting sub category details");
    }
}


