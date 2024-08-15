import express from 'express';
import tripPlanner from '../controllers/tripPlanner.controller.js';

const tripPlannerRoutes = express.Router();

tripPlannerRoutes.post('/plan', tripPlanner)

export default tripPlannerRoutes;