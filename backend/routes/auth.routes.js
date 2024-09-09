import express from 'express';
import { googleAuth, login, logOut, refreshAccessToken, signUp } from '../controllers/auth.controller.js';

const authRoutes = express.Router();

authRoutes.post('/signup', signUp);
authRoutes.post('/signin', login);
authRoutes.post('/google', googleAuth);
authRoutes.post('/refresh-token', refreshAccessToken);
authRoutes.post('/logout', logOut);

export default authRoutes;