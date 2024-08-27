import axios from 'axios';
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchPlaces = createAsyncThunk('places/fetchPlaces', async ({ page, limit, sortBy, filterCountry, searchTitle }) => {
    const response = await axios.get("http://localhost:5000/api/place/all-places", {
        params: { page, limit, sortBy, filterCountry, searchTitle }
    })
    return response.data
})

export const fetchPlaceDetails = createAsyncThunk('places/fetchPlaceDetails', async (placeId) => {
    const response = await axios.get(`http://localhost:5000/api/place/${placeId}`)
    return response.data
})

export const updatePlace = createAsyncThunk('places/updatePlace', async ({ placeId, updatedData }) => {
    const response = await axios.put(`http://localhost:5000/api/place/${placeId}`, updatedData, {
        withCredentials: true
    });
    return response.data;
});

export const deletePlace = createAsyncThunk('places/deletePlace', async (placeId) => {
    await axios.delete(`http://localhost:5000/api/place/${placeId}`, {
        withCredentials: true
    });
    return placeId;
});

const placesSlice = createSlice({
    name: "places",
    initialState: {
        places: [],
        viewDetails: null,
        placeLoading: false,
        error: null,
        totalPages: 1,
        currentPage: 1
    },
    reducers: {
        setPage: (state, action) => {
            state.currentPage = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPlaces.pending, (state) => {
                state.placeLoading = true
                state.error = null
            })
            .addCase(fetchPlaces.fulfilled, (state, action) => {
                state.placeLoading = false
                state.places = action.payload.places
                state.totalPages = action.payload.totalPages
                state.currentPage = action.payload.currentPage
            })
            .addCase(fetchPlaces.rejected, (state, action) => {
                state.placeLoading = false
                state.error = action.error.message
            })
            .addCase(fetchPlaceDetails.pending, (state) => {
                state.placeLoading = true
                state.error = null
            })
            .addCase(fetchPlaceDetails.fulfilled, (state, action) => {
                state.placeLoading = false
                state.viewDetails = action.payload
            })
            .addCase(fetchPlaceDetails.rejected, (state, action) => {
                state.placeLoading = false
                state.error = action.error.message
            })
            .addCase(updatePlace.pending, (state) => {
                state.placeLoading = false
                state.error = null
            })
            .addCase(updatePlace.fulfilled, (state, action) => {
                state.placeLoading = false
                const updatedPlace = action.payload;
                const index = state.places.findIndex(place => place._id === updatedPlace._id);
                if (index !== -1) {
                    state.places[index] = updatedPlace;
                }
                if (state.viewDetails && state.viewDetails._id === updatedPlace._id) {
                    state.viewDetails = updatedPlace;
                }
            })
            .addCase(updatePlace.rejected, (state, action) => {
                state.placeLoading = false
                state.error = action.error.message
            })
            .addCase(deletePlace.pending, (state) => {
                state.placeLoading = true
                state.error = null
            })
            .addCase(deletePlace.fulfilled, (state, action) => {
                state.placeLoading = false
                state.places = state.places.filter(place => place._id !== action.payload)
                if (state.viewDetails && state.viewDetails._id === action.payload) {
                    state.viewDetails = null;
                }
            })
            .addCase(deletePlace.rejected, (state, action) => {
                state.placeLoading = false
                state.error = action.error.message
            })
    }
})

export const { setPage } = placesSlice.actions

export default placesSlice.reducer