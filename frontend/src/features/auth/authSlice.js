import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../../Firebase/firebase.config';
import toast from 'react-hot-toast';
import { axiosInstance } from '../../hooks/useAxiosInterceptor';

const googleProvider = new GoogleAuthProvider()

export const signUp = createAsyncThunk('auth/signUp', async (userData, { rejectWithValue }) => {
    try {
        console.log("userData", userData)
        const response = await axiosInstance.post('/api/auth/signup', userData)
        const newUser = response.data.user

        return { user: newUser, isNewUser: true }

    } catch (error) {
        toast.error(error.response?.data?.error || 'Signup failed');
        return rejectWithValue(error.response?.data?.error || 'Signup failed');
    }
})

export const signIn = createAsyncThunk('auth/signIn', async (userData, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post('/api/auth/signin', userData);
        return response.data.user;
    } catch (error) {
        return rejectWithValue(error.response?.data?.error || 'Sign in failed');
    }
}
);

export const googleSignIn = createAsyncThunk(
    'auth/googleSignIn',
    async (_, { getState, rejectWithValue }) => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            const userData = {
                uid: user.uid,
                email: user.email,
                username: user.displayName,
                profilePicture: user.photoURL
            };

            const response = await axiosInstance.post('/api/auth/google', userData);

            const { users } = getState().auth
            const userExists = users.some(user => user._id === response.data.user._id || user.email === response.data.user.email)

            if (!userExists) {
                return { user: response.data.user, isNewUser: true };
            } else {
                return { user: response.data.user, isNewUser: false };
            }
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Google sign in failed');
        }
    }
);

export const updateUserProfile = createAsyncThunk(
    'auth/updateUserProfile',
    async (updatedUserData, { rejectWithValue }) => {
        try {
            return updatedUserData;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to Update');
        }
    }
);

export const logout = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            await axiosInstance.post('/api/auth/logout');
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Logout failed');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        currentUser: null,
        users: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(signUp.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signUp.fulfilled, (state, action) => {
                state.loading = false;
                state.currentUser = action.payload.user;
                if (action.payload.isNewUser) {
                    state.users.push(action.payload.user);
                }
                state.error = null;
            })
            .addCase(signUp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(signIn.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signIn.fulfilled, (state, action) => {
                state.loading = false;
                state.currentUser = action.payload;
                state.error = null;
            })
            .addCase(signIn.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateUserProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.currentUser = action.payload;
                state.error = null;
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(googleSignIn.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(googleSignIn.fulfilled, (state, action) => {
                state.loading = false;
                state.currentUser = action.payload.user;
                if (action.payload.isNewUser) {
                    state.users.push(action.payload.user);
                }
                state.error = null;
            })
            .addCase(googleSignIn.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(logout.fulfilled, (state) => {
                state.currentUser = null;
                state.loading = false;
                state.error = null;
            })
    },
});


export default authSlice.reducer;
