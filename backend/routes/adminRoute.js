import express from 'express';
import {addDoctor, getAllDoctors, loginAdmin, appointmentsAdmin, appointmentCancel, adminDashboard} from '../controllers/adminController.js';
import upload from '../middlewares/multer.js';
import authAdmin from '../middlewares/authAdmin.js';
import { changeAvailability } from '../controllers/doctorController.js';

const adminRouter = express.Router();

// Ensure 'upload' and 'addDoctor' are properly imported and implemented
adminRouter.post('/add-doctor',authAdmin, upload.single('image'), addDoctor);
adminRouter.post('/login', loginAdmin);
adminRouter.post('/all-doctors',authAdmin, getAllDoctors);
adminRouter.post('/change-availability',authAdmin, changeAvailability);
adminRouter.get('/appointments',authAdmin, appointmentsAdmin);
adminRouter.post('/appointment-cancel',authAdmin, appointmentCancel);
adminRouter.get('/dashboard',authAdmin, adminDashboard);

export default adminRouter;

