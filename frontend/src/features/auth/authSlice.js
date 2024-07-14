import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {
        userSignUpStart: (state) => {
            state.loading = true;
            state.user = null;
        },
        userSignUpSuccess: (state, action) => {
            state.loading = false;
            state.user = action.payload;
            state.error = null;
        },
        userSignUpFailed: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        userSignInStart: (state) => {
            state.loading = true;
            state.user = null;
        },
        userSignInSuccess: (state, action) => {
            state.loading = false;
            state.user = action.payload;
            state.error = null;
        },
        userSignInFailed: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        userLogOut: (state) => {
            state.user = null;
            state.error = null;
            state.loading = false;
        },
    },
});

export const {
    userSignUpStart,
    userSignUpSuccess,
    userSignUpFailed,
    userSignInStart,
    userSignInSuccess,
    userSignInFailed,
    userLogOut,
} = authSlice.actions;

export default authSlice.reducer;
