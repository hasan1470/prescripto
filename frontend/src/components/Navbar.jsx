import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets_frontend/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext';

const Navbar = () => {

    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);

    const { token, setToken, userData } = useContext(AppContext);

    const handleLogout = () => {
        setToken(false);
        localStorage.removeItem('token');
        navigate('/login');
    }

  return (

    <div className='flex justify-between items-center py-4 text-sm mb-5 border-b border-b-gray-400'>

        <img onClick={()=>navigate('/')} className='w-44 cursor-pointer' src={assets.logo} alt="Logo" />
        <ul className='hidden md:flex item-start gap-5 font-medium'>
            <NavLink to='/'>
                <li className='py-1'>Home</li>
            </NavLink>
            <NavLink to='/doctors'>
                <li className='py-1'>All Doctors</li>
            </NavLink>
            <NavLink to='/about'>
                <li className='py-1'>About</li>
            </NavLink>
            <NavLink to='/contact'>
                <li className='py-1'>Contact</li>
            </NavLink>
        </ul>
        <div className='flex items-center gap-4'>
            {
                token && userData ? 
                <div className='flex items-center gap-2 cursor-pointer relative group'>
                    <img className='w-8 rounded-full' src={userData.image} alt='' />
                    <img className='w-2.5' src={assets.dropdown_icon} alt='' />
                    <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
                        <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4 shadow-lg'>
                            <p onClick={()=>navigate('/my-profile')} className='hover:text-black cursor-pointer'>My Profile</p>
                            <p onClick={()=>navigate('/my-appointments')} className='hover:text-black cursor-pointer'>My Appointments</p>
                            <p onClick={handleLogout} className='hover:text-black cursor-pointer'>Logout</p>
                        </div>
                    </div>
                </div>
                : <button onClick={()=>navigate('/login')} className='bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block cursor-pointer'>Create Account</button>
            }
            <img onClick={() => setShowMenu(!showMenu)} className='w-6 cursor-pointer md:hidden' src={assets.menu_icon} alt="Menu Icon" />
            { /* Mobile Menu */}
            <div className={` ${showMenu ? 'fixed w-full' : 'h-0 w-0'} md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}>
                <div className='flex items-center justify-between px-5 py-6'>
                    <img onClick={()=> navigate('/')} className='w-36 cursor-pointer' src={assets.logo} alt="logo" />
                    <img className = 'w-7 cursor-pointer' src={assets.cross_icon} onClick={() => setShowMenu(!showMenu)} alt="Cross" />
                </div>
                <ul className='flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium'>  
                    <NavLink onClick={()=> setShowMenu(false)} to = '/'>Home</NavLink>
                    <NavLink onClick={()=> setShowMenu(false)} to = '/doctors'>All Doctors</NavLink>
                    <NavLink onClick={()=> setShowMenu(false)} to = '/about'>About</NavLink>
                    <NavLink onClick={()=> setShowMenu(false)} to = '/contact'>Contact</NavLink>
                </ul>
            </div>
            
        </div>


    </div>
  )
}

export default Navbar