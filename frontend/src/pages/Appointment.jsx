import { getSlots } from "../lib/demo-state";
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/app-context'
import {assets} from '../assets/assets_frontend/assets'
import RelatedDoctors from '../components/RelatedDoctors'
import { toast } from 'react-toastify'
import axios from '../lib/api'

const Appointment = () => {

  const {docID} = useParams()
  const {doctors, currencySymbol, backendUrl, token, getDoctorsData} = useContext(AppContext)
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
  const docInfo = doctors.find(doc=>doc._id===docID)
  const docSlots = useMemo(()=>docInfo ? getSlots(docInfo) : [],[docInfo])
  const [slotIndex, setSlotIndex] = useState(0)
  const [slotTime, setSlotTime] = useState('')

  const navigate = useNavigate()


const bookAppointment = async () => {
  if(!token) {
    toast.warn("Please login to book an appointment")
    return navigate('/login')
  }

  if (!slotTime || !docSlots[slotIndex]?.some(slot=>slot.time===slotTime)) return toast.warn("Choose an available appointment time first.");
  try {
    const date = docSlots[slotIndex][0].datetime

    let day = date.getDate()
    let month = date.getMonth() + 1
    let year = date.getFullYear()

    const slotDate = day + '-' + month + '-' + year

    const docId = docID

    const {data} = await axios.post(`${backendUrl}/api/user/book-appointment`, {
    docId, slotDate, slotTime}, {
      headers: {token}
    })

    if(data.success) {
      toast.success(data.message);
      getDoctorsData();
      navigate('/my-appointments')
    } else {

      toast.error(data.message);
    }


  } catch (error) {
    console.error(error)
    toast.error(error.message)
  }


}



  useEffect(()=>{setSlotIndex(0);setSlotTime('');},[docID]);

  if (!docInfo) return <p className='py-12 text-center'>Loading doctor details. <a className='underline' href='/doctors'>Browse all doctors</a></p>;
  return (
    <div>
      { /* Doctor Details Section */ }
      <div className='flex flex-col sm:flex-row gap-4'>
        <div>
          <img className='bg-primary w-full sm:max-w-72 rounded-lg' src={docInfo.image} alt=''/>

        </div>
        <div className='flex-1 border border-gray-300 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
          { /* DocInfo: Name, degree and experience */ }
          <p className='flex items-center gap-2 text-3xl font-medium text-gray-700'>{docInfo.name} <img className='w-5' src={assets.verified_icon} alt=''/></p>
          <div className='flex items-center gap-2 mt-1 text-gray-600'>
            <p>{docInfo.degree} - {docInfo.speciality}</p>
            <span className='py-0.5 px-2 border text-xs rounded-full'>{docInfo.experience}</span>
          </div>
          { /* Doctor About Section */ }
          <div>
            <p className='flex items-center gap-1 text-sm font-medium text-[#262626] mt-3'> About <img src={assets.info_icon}/></p>
            <p className='text-sm text-gray-600 max-w-[700px] mt-1'>{docInfo.about}</p>
          </div>
          <p className='text-gray-600 font-medium mt-4'>Appointment fee: <span className='text-gray-800'>{currencySymbol[0]}{docInfo.fees}</span></p>
        </div>
      </div>

      { /* Booking Slots Section */ }
      <div className='sm:ml-72 sm:pl-4 mt-8 font-medium text-gray-700'>
        <p>Booking Slots</p>{!docSlots.length && <p className='my-4 text-gray-500'>No appointment times are available. Please choose another doctor.</p>}

        <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
          {
            docSlots.length && docSlots.map((item, index) => (
              <button type="button" onClick={() => {setSlotIndex(index); setSlotTime('');}} className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-primary text-white' :'border border-gray-200'}`} key={index}>
                <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                <p>{item[0] && item[0].datetime.getDate()}</p>
              </button>
          ))
         }
        </div>

        <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>
          {docSlots.length && docSlots[slotIndex]?.map((item, index) => (
            <button type="button" onClick={()=> setSlotTime(item.time)} key={index}
            className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer
            ${item.time === slotTime ? 'bg-primary text-white' : 'text-gray-400 border border-gray-300'}`}>
              {item.time.toLowerCase()}
            </button>

          ))
          }
        </div>

        <button disabled={!slotTime || !docInfo.available} onClick={bookAppointment} className="disabled:opacity-50 bg-primary text-white text-sm font-light px-20 py-3 rounded-full my-6 cursor-pointer">Book an appointment</button>

      </div>

      { /* Related Doctors Section */ }

      <RelatedDoctors docID={docID} speciality={docInfo.speciality}/>


    </div>
  )
}

export default Appointment
