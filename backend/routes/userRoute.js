import express from 'express';
import { registerUser, loginUser, getUserProfile, updateUserProfile, bookAppointment, listAppointment, cancelAppointment } from '../controllers/userController.js';
import authUser from '../middlewares/authUser.js';
import upload from '../middlewares/multer.js';


const userRoute = express.Router();


userRoute.post('/register', registerUser);
userRoute.post('/login', loginUser);
userRoute.get('/get-profile', authUser, getUserProfile);
userRoute.post('/update-profile', authUser, upload.single('image'), updateUserProfile);
userRoute.post('/book-appointment', authUser, bookAppointment);
userRoute.get('/appointments', authUser, listAppointment);
userRoute.post('/cancel-appointment', authUser, cancelAppointment);


export default userRoute;