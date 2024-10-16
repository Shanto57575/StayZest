import express from 'express';
import {
    checkAuth,
    googleAuth,
    login,
    logOut,
    refreshAccessToken,
    signUp
} from '../controllers/auth.controller.js';

const authRoutes = express.Router();

authRoutes.post('/signup', signUp);
authRoutes.post('/signin', login);
authRoutes.post('/google', googleAuth);
authRoutes.post('/refresh-token', refreshAccessToken);
authRoutes.get("/check", checkAuth);
authRoutes.post('/logout', logOut);

export default authRoutes;