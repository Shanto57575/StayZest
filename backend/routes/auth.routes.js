import express from 'express';
import { googleAuth, login, logOut, signUp } from '../controllers/auth.controller.js';
import { verifyToken } from '../utils/jwtUtils.js';

const authRoutes = express.Router();

authRoutes.post('/signup', signUp);
authRoutes.post('/signin', login);
authRoutes.post('/google', googleAuth);
authRoutes.post('/logout', verifyToken, logOut);

export default authRoutes;