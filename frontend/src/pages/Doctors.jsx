import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Doctors = () => {

  const { speciality } = useParams()
  const navigate = useNavigate()
  const { doctors } = useContext(AppContext)
  const [filterDoc, setFilterDoc] = useState([])  
  const [showFiter, setShowFilter] = useState(false)

  const applyFilter = () => {
    if(speciality) {
      setFilterDoc(doctors.filter(doc => doc.speciality === speciality)) 
    } else {
      setFilterDoc(doctors) // If no speciality is provided, show all doctors
    }
  }

  useEffect(() => {
    applyFilter()
  }, [speciality, doctors])

  return (
    <div>
      <p className='text-gray-600'>Browse through the doctors specialist.</p>
      <div className='flex flex-col sm:flex-row items-start gap-2 mt-5'>
        <button onClick={() => setShowFilter(!showFiter)} className={`text-sm sm:hidden text-gray-800 border border-blue-600 px-4 py-2 rounded-md transition-all duration-300 ${showFiter ? ' bg-blue-600 text-white' : ''}`}>Filter</button>
        <div className={`flex flex-col gap-4 text-sm text-gray-600 ${showFiter ? 'flex' : 'hidden sm:flex'}`}>
          <p onClick={()=> navigate('/doctors/General physician')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "General physician" ? "bg-indigo-100 text-black" : "" }`}>General physician</p>
          <p onClick={()=> navigate('/doctors/Gynecologist')} class={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Gynecologist" ? "bg-indigo-100 text-black" : "" }`}>Gynecologist</p>
          <p onClick={()=> navigate('/doctors/Dermatologist')} class={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Dermatologist" ? "bg-indigo-100 text-black" : "" }`}>Dermatologist</p>
          <p onClick={()=> navigate('/doctors/Pediatricians')} class={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Pediatricians" ? "bg-indigo-100 text-black" : "" }`}>Pediatricians</p>
          <p onClick={()=> navigate('/doctors/Neurologist')} class={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Neurologist" ? "bg-indigo-100 text-black" : "" }`}>Neurologist</p>
          <p onClick={()=> navigate('/doctors/Gastroenterologist')} class={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Gastroenterologist" ? "bg-indigo-100 text-black" : "" }`}>Gastroenterologist</p>
        </div>
          <div className='w-full grid grid-cols-auto gap-4 gap-y-6'>
            {
              filterDoc.map((item,index) => (

                <div onClick={()=>navigate(`/appointment/${item._id}`)} key={index} className='border border-blue-300 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500'>
                    <img className='bg-blue-50' src={item.image} alt={item.name}  />
                    <div className='p-4'>
                        <div className={`flex items-center gap-2 text-sm text-center ${item.available ? 'text-green-500' : 'text-gray-500' }`}>
                            <p class={`w-2 h-2 rounded-full ${item.available ? 'bg-green-500' : 'bg-gray-500' } `}></p>
                            <p>{item.available ? 'Available' : 'Not Available'}</p>
                        </div>
                        <p className='text-gray-800 text-lg font-medium'>{item.name}</p>
                        <p className='text-gray-600 text-sm'>{item.speciality}</p>
                    </div>
                </div>


            ))
            }
          </div>
      </div>

      
    </div>
  )
}

export default Doctors