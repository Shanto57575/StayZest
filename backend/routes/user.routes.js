import express from 'express';
import {
    deleteUser,
    getAllUsers,
    getAllUsersWithBookingCount,
    getUserById,
    updateRole,
    updateUser
} from '../controllers/user.controller.js';
import { verifyToken } from '../utils/jwtUtils.js';
import { isAdmin, isSUPER_ADMIN } from '../utils/protectedRoutes.js';
import upload from '../utils/fileUpload.js';

const userRoutes = express.Router();

userRoutes.get('/allusers', verifyToken, isAdmin, getAllUsers);
userRoutes.get('/allUserswithBookingCount', verifyToken, isAdmin, getAllUsersWithBookingCount);
userRoutes.get('/:id', verifyToken, getUserById);
userRoutes.put('/:id', verifyToken, upload.single('profilePicture'), updateUser);
userRoutes.patch('/:id', verifyToken, isSUPER_ADMIN, updateRole);
userRoutes.delete('/:id', verifyToken, isAdmin, deleteUser);

export default userRoutes;