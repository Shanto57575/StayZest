import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        users: [],
        currentUser: null,
        loading: false,
        error: null,
    },
    reducers: {
        userSignUpStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        userSignUpSuccess: (state, action) => {
            state.loading = false;
            state.currentUser = action.payload;
            state.users?.push(action.payload);
            state.error = null;
        },
        userSignUpFailed: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        userSignInStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        userSignInSuccess: (state, action) => {
            state.loading = false;
            state.currentUser = action.payload;
            if (!state.users?.find(user => user._id === action.payload._id)) {
                state.users?.push(action.payload);
            }
            state.error = null;
        },
        userSignInFailed: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        userLogOut: (state) => {
            state.currentUser = null;
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