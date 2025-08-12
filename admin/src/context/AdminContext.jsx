import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";



export const AdminContext = createContext()

const AdminContextProvider = ( props ) => {

  const [aToken, setAToken] = useState(localStorage.getItem("aToken")?localStorage.getItem("aToken") : '');
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppintments] = useState([])
  const [dashData, setDashData] = useState(false)

  const backendUrl = import.meta.env.VITE_BACKEND_URL

  const getAllDoctors = async () => {

    try {

      const {data} = await axios.post(backendUrl + '/api/admin/all-doctors', {}, {
        headers: {aToken}})
        if(data.success) {
          setDoctors(data.doctors);
          console.log(data.doctors);
        } else {
          toast.error(data.message);
        }
      
    } catch (error) {
      toast.error(error.message || "Something went wrong while fetching doctors");
    }

   }

   const changeAvailability = async (docId) => {
    try {

      const {data} = await axios.post(backendUrl + '/api/admin/change-availability', {docId}, {
        headers: {aToken}})

        if(data.success) {
          toast.success(data.message);
          getAllDoctors();
        } else {
          toast.error(data.message);
        }
      
    } catch (error) {
      toast.error(error.message || "Something went wrong while changing availability");
    }
   }

   const getAllAppointments = async () => {

    try {

      const {data} = await axios.get(backendUrl + '/api/admin/appointments',  {
        headers: {aToken}})

      if (data.success) {
        setAppintments(data.appointments)
      } else {
        toast.error(data.message);
      }
      
    } catch (error) {
      toast.error(error.message);
    }

   }

   const cancelAppointment = async (appointmentId) => {
    try {

      const {data} = await axios.post(backendUrl + '/api/admin/appointment-cancel', {appointmentId},  {
        headers: {aToken}})

      if (data.success) {
        toast.success(data.message)
        getAllAppointments()
      } else {
        toast.error(data.error)
      }
      
    } catch (error) {
      toast.error(error.message);
    }
   }

   const getDashData = async () => {

    try {

      const {data} = await axios.get(backendUrl + '/api/admin/dashboard',  {
        headers: {aToken}})
      if (data.success) {
        setDashData(data.dashData)
        console.log(data.dashData)
      } else {
        toast.error(data.error)
      }
      
      
    } catch (error) {
      toast.error(error.message);

    }


   }


    const value = {

      aToken,
      setAToken,
      backendUrl,
      getAllDoctors,
      doctors,
      changeAvailability,
      appointments, setAppintments,
      getAllAppointments,
      cancelAppointment,
      getDashData, dashData,
        
        
    }


  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  )
}

export default AdminContextProvider;