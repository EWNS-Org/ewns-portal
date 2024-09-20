import { createStore, applyMiddleware, combineReducers } from 'redux';
import { ThunkMiddleware, thunk } from 'redux-thunk';
import { businessReducer } from './Reducers/business.reducer';

const rootReducer = combineReducers({
    business: businessReducer,
});

export const store = createStore(
    rootReducer,
    applyMiddleware(thunk as any) as any// Add thunk middleware
);

export type RootState = ReturnType<typeof rootReducer>;
