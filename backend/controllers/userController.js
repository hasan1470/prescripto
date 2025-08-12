import validator from 'validator';
import bcrypt from 'bcrypt';
import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken';
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

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

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
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    
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

const bookAppointment = async (req, res) => {
  try {
    const userId = req.userId;
    const { docId, slotDate, slotTime } = req.body;

    const docData = await doctorModel.findById(docId).select('-password');

    if (!docData.available) {
      return res.json({ success: false, message: 'Doctor not available' });
    }

    let slot_booked = docData.slot_booked

    // checking slot availablity
    if (slot_booked[slotDate]) {
      if(slot_booked[slotDate].includes(slotTime)) {
        return res.json({ success: false, message: 'Slot already booked' });
      } else {
        slot_booked[slotDate].push(slotTime);
    }
    } 
    else {
      slot_booked[slotDate] = [];
      slot_booked[slotDate].push(slotTime);
    }

    const userData = await userModel.findById(userId).select('-password');

    delete docData.slot_booked


    const appointmentData = {
      userId,
      docId,
      slotDate,
      slotTime,
      userData,
      docData,
      amount: docData.fees,
      date: Date.now(),
    };

    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();


    // Update doctor's slot_booked
    await doctorModel.findByIdAndUpdate(docId, {slot_booked: slot_booked });


    res.json({ success: true, message: 'Appointment booked successfully' });

    

  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
}


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
const cancelAppointment = async (req, res) => {

  try {

    const userId = req.userId;
    const {appointmentId} = req.body
    const appointmentData = await appointmentModel.findById(appointmentId)

    // verify appointment user
    if (appointmentData.userId !== userId) {
      return res.json({success: false, message: 'Unautorized action' })
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, {cancelled:true})


    // releasing doctor slot
    const {docId, slotDate, slotTime} = appointmentData
    const doctorData = await doctorModel.findById(docId)

    let slot_booked = doctorData.slot_booked

    slot_booked[slotDate] = slot_booked[slotDate].filter(e => e !== slotTime)

    await doctorModel.findByIdAndUpdate(docId, {slot_booked})

    res.json({success: true, message: 'Appointment Cancelled' })
    
    
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }


}



export { registerUser, loginUser, getUserProfile, updateUserProfile, bookAppointment, listAppointment, cancelAppointment };