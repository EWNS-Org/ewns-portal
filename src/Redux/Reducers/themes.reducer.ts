import { GET_ALL_THEMES } from "../Actions/Themes/themes.action.type";


const initialState = {
    allThemes: [],
    loading: false,
    error: null,
};

export const themesReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case GET_ALL_THEMES:
            return { ...state, allThemes: action.payload };
        default:
            return state;
    }
};