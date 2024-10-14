import { GET_ALBUM_DETAILS, GET_ALL_ALBUMS } from "../Actions/Albums/albums.action.types";

const initialState = {
    allAlbums: null,
    albumDetails: null,
    loading: false,
    error: null,
};

export const albumsReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case GET_ALL_ALBUMS:
            return { ...state, allAlbums: action.payload };
        case GET_ALBUM_DETAILS:
            return { ...state, albumDetails: action.payload };
        default:
            return state;
    }
};