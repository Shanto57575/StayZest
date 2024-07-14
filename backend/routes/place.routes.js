import express from 'express';
import { addPlace, getAllPlace, getPlaceById, removePlace, updatePlace } from '../controllers/place.controller.js';
import { verifyToken } from '../utils/jwtUtils.js';
import isAdmin from '../utils/protectedRoutes.js';
const placeRoutes = express.Router();

placeRoutes.post('/add-place', verifyToken, isAdmin, addPlace);
placeRoutes.get('/all-places', getAllPlace);
placeRoutes.get('/:id', getPlaceById);
placeRoutes.put('/:id', verifyToken, isAdmin, updatePlace);
placeRoutes.delete('/remove-place', verifyToken, isAdmin, removePlace);

export default placeRoutes;