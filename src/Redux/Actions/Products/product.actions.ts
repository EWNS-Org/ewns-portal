import toast from "react-hot-toast";
import { PRODUCT_START_LOADING, PRODUCT_STOP_LOADING, GET_ALL_PRODUCTS, GET_PRODUCT_DETAILS } from "./product.action.type";
import { addProductMediaData, addProductsData, deleteProductData,  getAllProductsData, getProductBySearch, getProductDetailsData, removeProductMediaData, updateProductData } from "../../../services/api/products.service";

export const setProductStartLoading = () => ({
    type: PRODUCT_START_LOADING
});

export const setProductStopLoading = () => ({
    type: PRODUCT_STOP_LOADING
});

export const getAllProducts = (productsData: any) => ({
    type: GET_ALL_PRODUCTS,
    payload: productsData
});

export const getProductDetails = (productData: any) => ({
    type: GET_PRODUCT_DETAILS,
    payload: productData
});


export const getAllProductsAction = (businessId: any, page: any, limit: any) => async (dispatch: any) => {
    try{
        dispatch(setProductStartLoading);
        let catData = await getAllProductsData(businessId, page, limit);
        dispatch(getAllProducts(catData));
        dispatch(setProductStopLoading);
    }
    catch(err: any){
        toast.error("Error getting all products");
    }
}

export const getProductDetailsAction = (businessId: any, productId: any) => async (dispatch: any) => {
    try{
        dispatch(setProductStartLoading);
        let catData = await getProductDetailsData(businessId, productId);
        dispatch(getProductDetails(catData));
        dispatch(setProductStopLoading);
        return catData;
    }
    catch(err: any){
        toast.error("Error getting product details");
    }
}

export const addProductAction = (businessId: any, data: any) => async (dispatch: any) => {
    try{
        dispatch(setProductStartLoading);
        let catData = await addProductsData(businessId, data);
        dispatch(setProductStopLoading);
    }
    catch(err: any){
        toast.error("Error adding product details");
    }
}

export const updateProductAction = (businessId: any, productId: any, payload: any) => async (dispatch: any) => {
    try{
        dispatch(setProductStartLoading);
        let catData = await updateProductData(businessId, productId, payload);
        dispatch(getAllProducts(catData));
        dispatch(setProductStopLoading);
    }
    catch(err: any){
        toast.error("Error updating product details");
    }
}

export const deleteProductAction = (businessId: any, productId: any) => async (dispatch: any) => {
    try{
        dispatch(setProductStartLoading);
        let catData = await deleteProductData(businessId, productId);
        dispatch(getAllProducts(catData));
        dispatch(setProductStopLoading);
    }
    catch(err: any){
        toast.error("Error deleting product details");
    }
}

export const addProductMediaAction = (businessId: any, productId: any, files: any) => async (dispatch: any) => {
    try{
        dispatch(setProductStartLoading);
        let catData = await addProductMediaData(businessId, productId, files);
        dispatch(setProductStopLoading);
    }
    catch(err: any){
        toast.error("Error Adding Product media");
    }
}

export const removeProductMediaAction = (businessId: any, productId: any, fileId: any) => async (dispatch: any) => {
    try{
        dispatch(setProductStartLoading);
        let catData = await removeProductMediaData(businessId, productId, fileId);
        dispatch(setProductStopLoading);
    }
    catch(err: any){
        toast.error("Error Removing Product media");
    }
}

export const getProductsBySearchAction = (businessId: any, keyword: any) => async (dispatch: any) => {
    try{
        dispatch(setProductStartLoading);
        let catData = await getProductBySearch(businessId, keyword);
        dispatch(setProductStopLoading);
        return catData;
    }
    catch(err: any){
        toast.error("Error Removing Product media");
    }
}