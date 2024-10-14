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

export const addSubAlbumsData = async (businessId: string, payload: any, albumId: any) => {
    try {
        const res: any = await post(`/album/sub/create?businessId=${businessId}&albumId=${albumId}`, payload);

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

export const AddImagesInAlbumsData = async (businessId: string, albumId: any, body: any, title: any) => {
    try {
        const formData = new FormData();
        formData.append('image', body.file);

        const res: any = await post(`/album/upload-image?businessId=${businessId}&albumId=${albumId}&title=${title}`, formData);

        return res.data;
    } catch (error: any) {
        toast.error(error.message || error);
        console.log(error)
    }
}

export const AddVideosInAlbumsData = async (businessId: string, albumId: any, files: any, title: any) => {
    try {
        const formData = new FormData();
        formData.append('video', files.file);

        const res: any = await post(`/album/upload-video?businessId=${businessId}&albumId=${albumId}&title=${title}`, formData);

        return res.data;
    } catch (error: any) {
        toast.error(error.message || error);
        console.log(error)
    }
}