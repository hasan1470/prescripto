import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import userModel from "../models/userModel.js";

// API for adding doctors

const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      speciality,
      experience,
      phone,
      degree,
      fees,
      about,
      address,
    } = req.body;
    const imageFile = req.file;

    // check if all required fields are provided
    if (
      !name ||
      !email ||
      !password ||
      !speciality ||
      !experience ||
      !phone ||
      !degree ||
      !fees ||
      !about ||
      !address ||
      !imageFile
    ) {
      return res
        .json({ message: "Please fill all the fields and upload an image" });
    }

    // validate email format
    if (!validator.isEmail(email)) {
      return res.json({ message: "Invalid email format" });
    }

    // validate strong password
    if (password.length < 8) {
      return res
        .json({ message: "Password Enter a Strong password" });
    }

    // hashing doctor password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // upload image to cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      folder: "doctors",
      resource_type: "image",
    });
    const imageUrl = imageUpload.secure_url;

    // create doctor data
    const doctorData = {
      name,
      email,
      password: hashedPassword,
      speciality,
      experience,
      phone,
      degree,
      fees,
      about,
      address: JSON.parse(address),
      date: Date.now(),
      image: imageUrl,
    };
    // create new doctor instance and save to database
    const newDoctor = new doctorModel(doctorData);
    await newDoctor.save();

    // send success response
    res
      .json({ message: "Doctor added successfully", doctor: newDoctor, success: true });
  } catch (error) {
    console.log(error);
    res
      .json({ message: error.message, Place: "addDoctor controller" });
  }
};

// API for admin login
const loginAdmin = async (req, res) => {
  try {

    const { email, password } = req.body;

    // check if email and password are provided
    if (!email || !password) {
      return res
        .json({ message: "Please provide email and password" });
    }

    // validate admin credentials
    if (
      email == process.env.ADMIN_EMAIL &&
      password == process.env.ADMIN_PASSWORD
    ) {
      // generate JWT token
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      res
        .json({
          success: true,
          token,
          message: "Admin logged in successfully",
        });
    } else {
      res.json({ message: "Unauthorized Attempt", success: false });
    }
  } catch (error) {
    console.log(error);
    res
      .json({ message: error.message, Place: "loginAdmin controller" });
  }
};

// API get for all doctors
const getAllDoctors = async (req, res) => { 
  try {
    const doctors = await doctorModel.find({}).select("-password");
    res.json({ success: true, doctors });
  } catch (error) {
    console.log(error);
    res.json({ message: error.message, Place: "getAllDoctors controller" });
  }
}


// API to get all appointments list

const appointmentsAdmin = async (req, res) => {

  try {

    const appointments = await appointmentModel.find({})
    res.json({success:true , appointments })

  } catch (error) {

    console.log(error);
    res.json({ message: error.message, Place: "appointmentsAdmin controller" });

  }

}

// API for appointments cencelled
const appointmentCancel = async (req, res) => {

  try {

    const { appointmentId} = req.body
    const appointmentData = await appointmentModel.findById(appointmentId)


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

//API to get dashboard data for admin panel

const adminDashboard = async (req, res) => {

  try {

    const doctors = await doctorModel.find({})
    const users = await userModel.find({})
    const appointments = await appointmentModel.find({})

    const dashData = {
      doctors: doctors.length,
      appointments: appointments.length,
      patients: users.length,
      latestAppointments: appointments.reverse().slice(0,5)
    }

    res.json({success:true, dashData})
    
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }


}








export { addDoctor, loginAdmin, getAllDoctors, appointmentsAdmin,  appointmentCancel, adminDashboard};
