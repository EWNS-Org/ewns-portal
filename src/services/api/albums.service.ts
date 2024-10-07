import toast from "react-hot-toast";
import { del, get, put, post } from "./api-service";



export const addAlbumsData = async (businessId: string, payload: any) => {
    try {
        const res: any = await post(`/album/create?businessId=${businessId}`, payload);

        return res.data;
    } catch (error: any) {
        toast.error(error.message || error);
        console.log(error)
    }
}


export const getAllAlbumsData = async (businessId: string) => {
    try {
        const res: any = await get(`/album/getAll?businessId=${businessId}`);

        return res.data;
    } catch (error: any) {
        toast.error(error.message || error);
        console.log(error)
    }
}

export const getAlbumDetailsData = async (businessId: any, albumId: any) => {
    try {
        const res: any = await get(`/album/get?businessId=${businessId}&albumId=${albumId}`);

        return res.data;
    } catch (error: any) {
        toast.error(error.message || error);
        console.log(error)
    }
}

export const updateAlbumsData = async (businessId: string, albumId: any, payload: any) => {
    try {
        const res: any = await put(`/album/update?businessId=${businessId}&albumId=${albumId}`, {...payload});

        return res.data;
    } catch (error: any) {
        toast.error(error.message || error);
        console.log(error)
    }
}

export const deleteAlbumsData = async (businessId: string, albumId: any) => {
    try {
        const res: any = await del(`/album/delete?businessId=${businessId}&albumId=${albumId}`);

        return res.data;
    } catch (error: any) {
        toast.error(error.message || error);
        console.log(error)
    }
}

export const AddImagesInAlbumsData = async (businessId: string, albumId: any, files: any) => {
    try {
        const res: any = await post(`/album/upload-images?businessId=${businessId}&albumId=${albumId}`, files);

        return res.data;
    } catch (error: any) {
        toast.error(error.message || error);
        console.log(error)
    }
}

export const AddVideosInAlbumsData = async (businessId: string, albumId: any, files: any) => {
    try {
        const res: any = await post(`/album/upload-videos?businessId=${businessId}&albumId=${albumId}`, files);

        return res.data;
    } catch (error: any) {
        toast.error(error.message || error);
        console.log(error)
    }
}