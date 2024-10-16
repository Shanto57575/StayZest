import express from 'express';
import { addPlace, getAllPlace, getPlaceById, removePlace, updatePlace } from '../controllers/place.controller.js';
import { verifyToken } from '../utils/jwtUtils.js';
import { isAdmin, isSUPER_ADMIN } from '../utils/protectedRoutes.js';
const placeRoutes = express.Router();

placeRoutes.post('/add-place', verifyToken, isAdmin, addPlace);
placeRoutes.get('/allPlaces', verifyToken, getAllPlace);
placeRoutes.get('/:id', verifyToken, getPlaceById);
placeRoutes.put('/:id', verifyToken, isAdmin, updatePlace);
placeRoutes.delete('/:id', verifyToken, isSUPER_ADMIN, removePlace);

export default placeRoutes;