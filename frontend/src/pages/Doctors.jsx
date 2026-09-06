import React, { useContext, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/app-context'

const Doctors = () => {

  const { speciality } = useParams()
  const navigate = useNavigate()
  const { doctors } = useContext(AppContext)
  const [search,setSearch]=useState('')
  const [showFiter, setShowFilter] = useState(false)

  const filterDoc = doctors.filter(doc => (!speciality || doc.speciality === speciality) && doc.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <h1 className='text-3xl font-semibold'>Find your doctor</h1><p className='mt-2 text-gray-600'>Explore specialties and choose an available appointment.</p><label className='block my-5'><span className='mb-2 block text-sm'>Search doctors</span><input type='search' value={search} onChange={e=>setSearch(e.target.value)} className='w-full rounded-lg border border-gray-300 p-3' placeholder='Search by doctor name'/></label>
      <div className='flex flex-col sm:flex-row items-start gap-2 mt-5'>
        <button onClick={() => setShowFilter(!showFiter)} className={`text-sm sm:hidden text-gray-800 border border-blue-600 px-4 py-2 rounded-md transition-all duration-300 ${showFiter ? ' bg-blue-600 text-white' : ''}`}>Filter</button>
        <div className={`flex flex-col gap-4 text-sm text-gray-600 ${showFiter ? 'flex' : 'hidden sm:flex'}`}>
          <button type="button" onClick={()=> navigate('/doctors/General physician')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "General physician" ? "bg-indigo-100 text-black" : "" }`}>General physician</button>
          <button type="button" onClick={()=> navigate('/doctors/Gynecologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Gynecologist" ? "bg-indigo-100 text-black" : "" }`}>Gynecologist</button>
          <button type="button" onClick={()=> navigate('/doctors/Dermatologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Dermatologist" ? "bg-indigo-100 text-black" : "" }`}>Dermatologist</button>
          <button type="button" onClick={()=> navigate('/doctors/Pediatricians')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Pediatricians" ? "bg-indigo-100 text-black" : "" }`}>Pediatricians</button>
          <button type="button" onClick={()=> navigate('/doctors/Neurologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Neurologist" ? "bg-indigo-100 text-black" : "" }`}>Neurologist</button>
          <button type="button" onClick={()=> navigate('/doctors/Gastroenterologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Gastroenterologist" ? "bg-indigo-100 text-black" : "" }`}>Gastroenterologist</button>
        </div>
          <div className='w-full grid grid-cols-auto gap-4 gap-y-6'>
            {filterDoc.length===0&&<p className='py-8 text-gray-500'>No doctors match. Try another name or specialty.</p>}
            {
              filterDoc.map((item,index) => (

                <button type='button' onClick={()=>navigate(`/appointment/${item._id}`)} key={index} className='border border-blue-300 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500'>
                    <img className='bg-blue-50' src={item.image} alt={item.name}  />
                    <div className='p-4'>
                        <div className={`flex items-center gap-2 text-sm text-center ${item.available ? 'text-green-500' : 'text-gray-500' }`}>
                            <p className={`w-2 h-2 rounded-full ${item.available ? 'bg-green-500' : 'bg-gray-500' } `}></p>
                            <p>{item.available ? 'Available' : 'Unavailable'}</p>
                        </div>
                        <p className='text-gray-800 text-lg font-medium'>{item.name}</p>
                        <p className='text-gray-600 text-sm'>{item.speciality}</p>
                    </div>
                </button>


            ))
            }
          </div>
      </div>

      
    </div>
  )
}

export default Doctors