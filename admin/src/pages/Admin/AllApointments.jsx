import React from 'react'
import { useContext } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { useEffect } from 'react'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets_admin/assets'

const AllApointments = () => {

  const {aToken, getAllAppointments, appointments, cancelAppointment} = useContext(AdminContext)
  const {calculateAge, slotDateFormat, currencySymbol} = useContext(AppContext)
  

  useEffect(() => {
    if (aToken) {
      getAllAppointments()
    }
  }, [aToken])


  return (
    <div className='w-full max-w-6xl m-5'>

      <p className='mb-3 text-lg font-medium'>All Appointments</p>

      <div className='bg-white border rounded border-gray-100 text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll '>

        <div className='hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b border-gray-100'>
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Actions</p>
        </div>

        {appointments.map((item,index) => (
          <div className='flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b border-gray-100 hover:bg-gray-50' key={index}>

            <p className='max-sm:hidden'>{index+1}</p>
            <div className='flex items-center gap-2'>
              <img className='w-8 rounded-full bg-gray-200' src={item.userData.image} alt='' /> <p>{item.userData.name}</p>
            </div>
            <p className='max-sm:hidden'>{calculateAge(item.userData.dateOfBirth)}</p>
            <p>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>
            <div className='flex items-center gap-2'>
              <img className='w-8 rounded-full bg-gray-200' src={item.docData.image} alt='' /> <p>{item.docData.name}</p>
            </div>
            <p>{item.amount}{currencySymbol[0]}</p>
            
            {
              item.cancelled
              ? <p className='text-red-600 text-xs font-medium'>Cancelled</p>
              : item.isCompleted
              ? <p className='text-green-700 text-xs font-medium'>Completed</p>
              :  <div className='flex'>
              <button type="button" aria-label={`Cancel appointment ${item._id}`} onClick={() => cancelAppointment(item._id)}><img className="w-10" src={assets.cancel_icon} alt="" /></button>
            </div>

            }
            

          </div>
        ))

        }




      </div>



    </div>
  )
}

export default AllApointments