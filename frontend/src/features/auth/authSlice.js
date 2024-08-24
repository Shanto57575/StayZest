import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../../Firebase/firebase.config';
import axios from 'axios';
import toast from 'react-hot-toast';

const googleProvider = new GoogleAuthProvider()

export const googleSignIn = createAsyncThunk(
    'auth/googleSignIn',
    async ({ navigate, from }, { rejectWithValue }) => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            const userData = {
                uid: user.uid,
                email: user.email,
                username: user.displayName,
                profilePicture: user.photoURL
            };

            const response = await axios.post('http://localhost:5000/api/auth/google', userData, { withCredentials: true });

            if (response.data) {
                toast.success("Successfully Logged In");
                navigate(from, { replace: true });
                return response.data;
            } else {
                throw new Error(response.data.error || 'Failed to authenticate with Google');
            }
        } catch (error) {
            console.error("Error during Google sign-in:", error.message);
            return rejectWithValue(error.message);
        }
    }
);

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
            state.users.push(action.payload);
            state.currentUser = action.payload;
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
            state.error = null;
            if (!state.users.some(user => user.uid === action.payload.uid)) {
                state.users.push(action.payload);
            }
        },
        userSignInFailed: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        userLogOut: (state) => {
            state.loading = false;
            state.currentUser = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(googleSignIn.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(googleSignIn.fulfilled, (state, action) => {
                state.loading = false;
                state.currentUser = action.payload.user;
                state.error = null;
            })
            .addCase(googleSignIn.rejected, (state, action) => {
                state.loading = false; // Ensure loading is turned off
                state.error = action.payload;
            });
    }

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
