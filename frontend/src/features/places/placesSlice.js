import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';

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

const placesSlice = createSlice({
    name: "places",
    initialState: {
        places: [],
        viewDetails: null,
        loading: false,
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
                state.loading = true
                state.error = null
            })
            .addCase(fetchPlaces.fulfilled, (state, action) => {
                state.loading = false
                state.places = action.payload.places
                state.totalPages = action.payload.totalPages
                state.currentPage = action.payload.currentPage
            })
            .addCase(fetchPlaces.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })
            .addCase(fetchPlaceDetails.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchPlaceDetails.fulfilled, (state, action) => {
                state.loading = false
                state.viewDetails = action.payload
            })
            .addCase(fetchPlaceDetails.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })
    }
})

export const { setPage } = placesSlice.actions

export default placesSlice.reducer