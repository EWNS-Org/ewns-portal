import toast from "react-hot-toast";
import { ALBUM_START_LOADING, ALBUM_STOP_LOADING, GET_ALBUM_DETAILS, GET_ALL_ALBUMS } from "./albums.action.types";
import { addAlbumsData, AddImagesInAlbumsData, addSubAlbumsData, AddVideosInAlbumsData, deleteAlbumsData, getAlbumDetailsData, getAllAlbumsData, updateAlbumsData } from "../../../services/api/albums.service";

export const setAlbumStartLoading = () => ({
    type: ALBUM_START_LOADING
});

export const setAlbumStopLoading = () => ({
    type: ALBUM_STOP_LOADING
});

export const getAllAlbums = (albumsData: any) => ({
    type: GET_ALL_ALBUMS,
    payload: albumsData
});

export const getAlbumDetails = (albumData: any) => ({
    type: GET_ALBUM_DETAILS,
    payload: albumData
});


export const getAllAlbumsAction = (businessId: any) => async (dispatch: any) => {
    try{
        dispatch(setAlbumStartLoading());
        let catData = await getAllAlbumsData(businessId);
        dispatch(getAllAlbums(catData));
        dispatch(setAlbumStopLoading);
    }
    catch(err: any){
        toast.error("Error getting all albums");
    }
}

export const createAlbumsAction = (businessId: any, payload: any) => async (dispatch: any) => {
    try{
        dispatch(setAlbumStartLoading());
        let catData = await addAlbumsData(businessId, payload);
        dispatch(setAlbumStopLoading);
    }
    catch(err: any){
        toast.error("Error getting all albums");
    }
}

export const createSubAlbumsAction = (businessId: any, payload: any, albumId: any) => async (dispatch: any) => {
    try{
        dispatch(setAlbumStartLoading());
        let catData = await addSubAlbumsData(businessId, payload, albumId);
        dispatch(setAlbumStopLoading);
    }
    catch(err: any){
        toast.error("Error getting all albums");
    }
}

export const getAlbumDetailsAction = (businessId: any, albumId: any) => async (dispatch: any) => {
    try{
        dispatch(setAlbumStartLoading());
        let catData = await getAlbumDetailsData(businessId, albumId);
        dispatch(getAlbumDetails(catData));
        dispatch(setAlbumStopLoading);
    }
    catch(err: any){
        toast.error("Error getting album details");
    }
}

export const updateAlbumDetailsAction = (businessId: any, albumId: any, payload: any) => async (dispatch: any) => {
    try{
        dispatch(setAlbumStartLoading());
        let catData = await updateAlbumsData(businessId, albumId, payload);
        dispatch(setAlbumStopLoading);
        return catData;
    }
    catch(err: any){
        toast.error("Error getting album details");
    }
}

export const deleteAlbumAction = (businessId: any, data: any) => async (dispatch: any) => {
    try{
        dispatch(setAlbumStartLoading());
        let catData = await deleteAlbumsData(businessId, data);
        dispatch(setAlbumStopLoading());
    }
    catch(err: any){
        toast.error("Error adding album details");
    }
}


export const AddImagesInAlbumsAction = (businessId: any, albumId: any, body: any, title: any) => async (dispatch: any) => {
    try{
        dispatch(setAlbumStartLoading());
        let catData = await AddImagesInAlbumsData(businessId, albumId, body, title);
        dispatch(setAlbumStopLoading());
    }
    catch(err: any){
        toast.error("Error adding album details");
    }
}

export const AddVideosInAlbumAction = (businessId: any, albumId: any, files: any, title: any) => async (dispatch: any) => {
    try{
        dispatch(setAlbumStartLoading());
        let catData = await AddVideosInAlbumsData(businessId, albumId, files, title);
        dispatch(setAlbumStopLoading());
    }
    catch(err: any){
        toast.error("Error adding album details");
    }
}