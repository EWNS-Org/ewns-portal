import { createStore, applyMiddleware, combineReducers } from 'redux';
import { ThunkMiddleware, thunk } from 'redux-thunk';
import { businessReducer } from './Reducers/business.reducer';
import { appointmentsReducer } from './Reducers/appointment.reducer';
import { categoriesReducer } from './Reducers/categories.reducer';
import { albumsReducer} from './Reducers/albums.reducer';
import { testimonialsReducer } from './Reducers/testimonials.reducer';

const rootReducer = combineReducers({
    business: businessReducer,
    appointments: appointmentsReducer,
    categories: categoriesReducer,
    albums: albumsReducer,
    testimonials: testimonialsReducer
});

export const store = createStore(
    rootReducer,
    applyMiddleware(thunk as any) as any// Add thunk middleware
);

export type RootState = ReturnType<typeof rootReducer>;
