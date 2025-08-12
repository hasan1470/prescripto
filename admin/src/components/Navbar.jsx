import React, { useContext } from 'react'
import { AdminContext } from '../context/AdminContext'
import {assets} from '../assets/assets_admin/assets'
import { useNavigate } from 'react-router-dom'
import { DoctorContext } from '../context/DoctorContext'


const Navbar = () => {

  const navigate = useNavigate()
  const { aToken, setAToken } = useContext(AdminContext)
  const { dToken, setDToken } = useContext(DoctorContext)
  const logout = () => {

      navigate('/login')
      aToken && setAToken('')
      aToken && localStorage.removeItem('aToken')
      window.location.reload()

      dToken && setDToken('')
      dToken && localStorage.removeItem('dToken')
      window.location.reload()

  }

  return (
    <div className='flex items-center justify-between bg-white px-4 sm:px-10 py-4 border-b border-gray-200'>
        <div className='flex items-center gap-2 text-xs'>
            <img src={assets.admin_logo} alt="Logo" className='w-36 sm:w-40 cursor-pointer' />
            <p className='border px-2.5 py-05 rounded-full border-gray-500 text-gray-600'> {aToken ? 'Admin' : 'Doctor'}</p>
        </div>
        <button onClick={logout} className='bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition duration-200 cursor-pointer'>Logout</button>
    </div>
  )
}

export default Navbar