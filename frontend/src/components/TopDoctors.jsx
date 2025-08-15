import React, {useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext';

const TopDoctors = () => {

    const navigate = useNavigate()
    const { doctors } = useContext(AppContext)

  return (
    <div className='flex flex-col items-center gap-4 my-16 text-gray-800 md:my-15'>
        <h2 class="text-3xl font-semibold text-center">Top Doctors to Book</h2>
        <p class="sm:w-1/3 text-center text-sm">Simply browse through our extensive list of trusted doctors.</p>
        <div className='w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0'>
            {doctors.slice(0,10).map((item,index) => (

                <div onClick={()=>{navigate(`/appointment/${item._id}`); scrollTo(0,0)}} key={index} className='border border-blue-300 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500'>
                    <img className='bg-blue-50' src={item.image} alt={item.name}  />
                    <div className='p-4'>
                        <div className={`flex items-center gap-2 text-sm text-center ${item.available ? 'text-green-500' : 'text-gray-500' }`}>
                            <p class={`w-2 h-2 rounded-full ${item.available ? 'bg-green-500' : 'bg-gray-500' } `}></p>
                            <p>{item.available ? 'Available' : 'Unavailable'}</p>
                        </div>
                        <p class="text-gray-800 text-lg font-medium">{item.name}</p>
                        <p class="text-gray-600 text-sm">{item.speciality}</p>
                    </div>
                </div>


            ))}
        </div>
        <button onClick={() => {navigate('/doctors'); scrollTo(0,0)}} className='bg-blue-100 text-gray-600 px-12 py-3 rounded-full mt-10 cursor-pointer'>More</button>
    </div>
  )
}

export default TopDoctors