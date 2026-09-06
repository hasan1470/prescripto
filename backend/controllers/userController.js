import { validateSlot, cancelBooking } from "../lib/booking.js";
import { isValidObjectId } from "mongoose";
import validator from 'validator';
import bcrypt from 'bcrypt';
import userModel from '../models/userModel.js';
import { issueToken } from "../lib/auth.js";
import {v2 as cloudinary} from 'cloudinary';
import doctorModel from '../models/doctorModel.js';
import appointmentModel from '../models/appointmentModel.js';


// api to register user

const registerUser = async (req, res) => {
  try {
    // Simulate user registration logic
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.json({ success:false,  message: 'missing info' });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success:false, message: 'Invalid email format' });
    }

    if (password.length < 8) {
      return res.json({ success:false, message: 'Password must be at least 8 characters long' });
    }

    //hashing password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      name,
      email,
      password: hashedPassword,
      dateOfBirth:  Date.now(),
    }


    const newUser = new userModel(userData);
    const user = await newUser.save();

    const token = issueToken("user", user._id)

    res.json({success:true, token})

  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message});
  }
}


// API for user login

const loginUser = async (req, res) => { 
    try {
        const { email, password } = req.body;
    
        // Check if email and password are provided
        if (!email || !password) {
        return res.json({ success: false, message: 'Please provide email and password' });
        }
    
        // Find user by email
        const user = await userModel.findOne({ email });
        if (!user) {
        return res.json({ success: false, message: 'User not found' });
        }
    
        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
        return res.json({ success: false, message: 'Invalid credentials' });
        }
    
        // Generate JWT token
        const token = issueToken("user", user._id);
    
        res.json({ success: true, token });
    
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}


/// API to get user profile data with token authentication

const getUserProfile = async (req, res) => {
  try {

    const userId = req.userId;
    
    const userData = await userModel.findById(userId).select('-password');
    res.json({ success: true, userData });



  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }

}


// API to update user profile data with token authentication

const updateUserProfile = async (req, res) => {
  try {
    const userId = req.userId
    const { name, phone, dateOfBirth, gender, address } = req.body;
    const imageFile = req.file;


    if (!name || !phone || !dateOfBirth || !gender || !address) {
      return res.json({ success: false, message: 'Missing required fields' });
    }



    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { name, phone, dateOfBirth, gender, address: JSON.parse(address) })
      
    if (imageFile) {
      const uploadResult = await cloudinary.uploader.upload(imageFile.path, {
        folder: 'users',
        resource_type: 'image',
      });
      const imageURL = uploadResult.secure_url;
      updatedUser.image = imageURL;
      await updatedUser.save();

    }

    res.json({ success: true, message: 'Profile updated successfully'});

  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
}

//API to book appointment

const bookAppointment = async (req,res) => {
  let reserved;
  let path;
  try {
    const {docId,slotDate,slotTime}=req.body;
    if(!isValidObjectId(docId))return res.status(400).json({success:false,message:"Invalid doctor."});
    path=validateSlot(slotDate,slotTime);
    const userData=await userModel.findById(req.userId).select('-password');
    if(!userData)return res.status(401).json({success:false,message:"Please sign in again."});
    // The condition and reservation run in one database operation.
    reserved=await doctorModel.findOneAndUpdate({_id:docId,available:true,[path]:{$ne:slotTime}},{$addToSet:{[path]:slotTime}},{new:true}).select('-password -email');
    if(!reserved)return res.status(409).json({success:false,message:"That time is no longer available. Choose another slot."});
    const docData=reserved.toObject();delete docData.slot_booked;
    await appointmentModel.create({userId:req.userId,docId,slotDate,slotTime,userData:userData.toObject(),docData,amount:reserved.fees,date:Date.now()});
    reserved=null;
    res.json({success:true,message:"Appointment booked successfully."});
  }catch(error){
    if(reserved)await doctorModel.updateOne({_id:reserved._id},{$pull:{[path]:req.body.slotTime}});
    res.status(400).json({success:false,message:error.message});
  }
};

// API to get user appointment for frontend my-appointment page
const listAppointment = async (req, res) => {

  try {

    const userId = req.userId;
    const appointments = await appointmentModel.find({userId})

    res.json({ success: true, appointments });
    
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }


}

// API to delete user appointment 
const cancelAppointment = async (req,res) => {
  try {
    if(!isValidObjectId(req.body.appointmentId))return res.status(400).json({success:false,message:"Invalid appointment."});
    const cancelled=await cancelBooking(req.body.appointmentId,{userId:req.userId});
    res.json({success:cancelled,message:cancelled?"Appointment cancelled.":"This appointment is already closed or unavailable."});
  }catch{res.status(400).json({success:false,message:"Unable to cancel the appointment."});}
};

export { registerUser, loginUser, getUserProfile, updateUserProfile, bookAppointment, listAppointment, cancelAppointment };