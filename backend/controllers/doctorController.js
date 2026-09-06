import { cancelBooking } from "../lib/booking.js";
import doctorModel from "../models/doctorModel.js";
import bcrypt from 'bcrypt'
import { issueToken } from "../lib/auth.js";
import appointmentModel from "../models/appointmentModel.js";


const changeAvailability = async (req, res) => {
  try {
    const { docId } = req.body;

    // find the doctor and update availability
    const doctorData = await doctorModel.findById(docId);
    const updatedDoctor = await doctorModel.findByIdAndUpdate(
      docId,
      { available: !doctorData.available },
    );

    res.json({ message: "Availability updated successfully", success: true, doctor: { ...updatedDoctor.toObject(), password: undefined } });

  } catch (error) {
    console.log(error);
    res.json({ message: error.message, Place: "changeAvailability controller" });
  }
}

const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select("-password -email -phone");
    res.json({ success: true, doctors });
  } catch (error) {
    console.log(error);
    res.json({ message: error.message, Place: "doctorList controller" });
  }
}

const loginDoctor = async(req, res) => {

  try {

    const {email, password} = req.body
    const doctor = await doctorModel.findOne({email})

    if(!doctor) {
      return res.json({success:false, message:'Invalid Credentials'})
    }

    const isMatch = await bcrypt.compare(password, doctor.password)
    if(isMatch) {
      const token =issueToken("doctor", doctor._id)
      res.json({success:true, token})
    } else {
      res.json({success:false, message:'Invalid Credentials'})
    }
    
  } catch (error) {
    console.log(error);
    res.json({ message: error.message, Place: "loginDoctor controller" });
    
  }

}

//API to get doctor appointments for doctor panel
const appointmentsDoctor = async (req, res) => {
  try {

    const docId = req.docId;
    const appointments = await appointmentModel.find({docId})

    res.json({success:true, appointments})
    
  } catch (error) {
    console.log(error);
    res.json({ message: error.message, Place: "appointmentsDoctor controller" });
    
  }
}

//API to mark appoint complete for doctor panel
const appointmentComplete = async (req, res) => {
  try {
  
    const docId = req.docId;
    const { appointmentId} = req.body
    const appointmentData = await appointmentModel.findById(appointmentId)

    if (appointmentData && !appointmentData.cancelled && !appointmentData.isCompleted && appointmentData.docId === docId) {
      await appointmentModel.findOneAndUpdate({_id:appointmentId,docId,cancelled:false}, {isCompleted:true})
      return res.json({success:true, message:'Appointment Complete'})
    } else {
      return res.json({success:false, message:'Mark Failed'})
    }
    
  } catch (error) {
    console.log(error);
    res.json({ message: error.message, Place: "appointmentComplete controller" });
  }
}

//API to cancel appoint complete for doctor panel
const appointmentCancel = async (req,res) => {
  try {const success=await cancelBooking(req.body.appointmentId,{docId:req.docId});res.json({success,message:success?"Appointment cancelled.":"This appointment is already closed or unavailable."});}
  catch{res.status(400).json({success:false,message:"Unable to cancel this appointment."});}
}


// API to get dashboard data for doctor panel
const doctorDashboard = async (req, res) => {
  try {
  
    const docId = req.docId;
    const appointments = await appointmentModel.find({docId})

    let earnings = 0

    appointments.map((item) => {
      if(item.isCompleted || item.payment) {
        earnings += item.amount

      }
    } )

    let patients =[]

    appointments.map((item) => {
      if(!patients.includes(item.userId)) {
        patients.push(item.userId)
      }
    })

    const dashData = {
      earnings,
      appointments : appointments.length,
      patients: patients.length,
      latestAppointments: appointments.reverse().slice(0,5)
    }

    res.json({success:true, dashData})
    
    
  } catch (error) {
    console.log(error);
    res.json({ message: error.message, Place: "doctorDashboard controller" });
  }
}


// API to get doctor profile for doctor panel

const doctorProfile = async (req, res) => {
  try {

    const docId = req.docId;
    const profileData = await doctorModel.findById(docId).select('-password')

   res.json({success:true, profileData})
    
  } catch (error) {
    console.log(error);
    res.json({ message: error.message, Place: "doctorProfile controller" });
  }
}


// API to update doctor profile for doctor panel

const updateDoctorProfile = async (req, res) => {
  try {

    const docId = req.docId;
    const {fees, address, available} = req.body

    await doctorModel.findByIdAndUpdate(docId, {fees, address, available})


   res.json({success:true, message:'Profile Update'})
    
  } catch (error) {
    console.log(error);
    res.json({ message: error.message, Place: "updateDoctorProfile controller" });
  }
}

export {changeAvailability, doctorList, loginDoctor, appointmentsDoctor, appointmentComplete, appointmentCancel, doctorDashboard, doctorProfile, updateDoctorProfile };