import { combineReducers, configureStore } from '@reduxjs/toolkit';
import placesReducer from '../features/places/placesSlice';
import authReducer from '../features/auth/authSlice';
import storage from 'redux-persist/lib/storage';
import { persistStore, persistReducer } from 'redux-persist';
import themeReducer from '../features/theme/themeSlice';

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth', 'places', 'theme'],
}

const rootReducer = combineReducers({
    theme: themeReducer,
    places: placesReducer,
    auth: authReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    })
})

const persistor = persistStore(store)

export { store, persistor };