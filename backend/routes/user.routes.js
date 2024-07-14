import express from 'express';
import { deleteUser, getAllUsers, getUserById, updateUser } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/jwtUtils.js';
import isAdmin from '../utils/protectedRoutes.js';
import upload from '../utils/fileUpload.js';
import multer from 'multer'

const userRoutes = express.Router();

userRoutes.get('/allusers', verifyToken, isAdmin, getAllUsers);
userRoutes.get('/:id', verifyToken, getUserById);
userRoutes.put('/:id', verifyToken, upload.single('profilePicture'), updateUser);
userRoutes.delete('/:id', verifyToken, isAdmin, deleteUser);

export default userRoutes;