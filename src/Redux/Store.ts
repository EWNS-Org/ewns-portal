import { createStore, applyMiddleware, combineReducers } from 'redux';
import { ThunkMiddleware, thunk } from 'redux-thunk';
import { businessReducer } from './Reducers/business.reducer';
import { appointmentsReducer } from './Reducers/appointment.reducer';
import { categoriesReducer } from './Reducers/categories.reducer';
import { albumsReducer} from './Reducers/albums.reducer';
import { testimonialsReducer } from './Reducers/testimonials.reducer';
import { productsReducer } from './Reducers/products.reducer';
import { themesReducer } from './Reducers/themes.reducer';

const rootReducer = combineReducers({
    business: businessReducer,
    appointments: appointmentsReducer,
    categories: categoriesReducer,
    albums: albumsReducer,
    testimonials: testimonialsReducer,
    products: productsReducer,
    themes: themesReducer
});

export const store = createStore(
    rootReducer,
    applyMiddleware(thunk as any) as any// Add thunk middleware
);

export type RootState = ReturnType<typeof rootReducer>;
