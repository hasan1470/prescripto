const ADMIN_URL = import.meta.env.VITE_ADMIN_URL || 'https://prescripto-doctorbooking-admin.vercel.app';
import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets_frontend/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/app-context';

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
            <NavLink to='/my-appointments'><li className='py-1'>Appointments</li></NavLink>
            <NavLink to='/about'>
                <li className='py-1'>About</li>
            </NavLink>
            <a href={ADMIN_URL} target="_blank" rel="noreferrer" className="py-1 text-primary font-semibold">Admin demo</a>
            <NavLink to='/contact'>
                <li className='py-1'>Contact</li>
            </NavLink>
        </ul>
        <div className='flex items-center gap-4'>
            {
                token && userData ? 
                <details className='relative'><summary className='flex items-center gap-2 cursor-pointer list-none' aria-label='Account menu'>
                    <img className='w-8 rounded-full' src={userData.image} alt='' />
                    <img className='w-2.5' src={assets.dropdown_icon} alt='' />
                    </summary><div className='absolute right-0 top-10 text-base font-medium text-gray-600 z-20'>
                        <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4 shadow-lg'>
                            <NavLink to='/my-profile'>My Profile</NavLink>
                            <NavLink to='/my-appointments'>My Appointments</NavLink>
                            <button type='button' onClick={handleLogout} className='hover:text-black cursor-pointer'>Logout / reset demo</button>
                        </div>
                    </div>
                </details>
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
                    <NavLink onClick={()=> setShowMenu(false)} to = '/my-appointments'>My Appointments</NavLink>
                    <NavLink onClick={()=> setShowMenu(false)} to = '/about'>About</NavLink>
                    <a href={ADMIN_URL} target="_blank" rel="noreferrer" onClick={()=>setShowMenu(false)} className="text-primary">Admin demo · admin / admin</a>
                    <NavLink onClick={()=> setShowMenu(false)} to = '/contact'>Contact</NavLink>
                </ul>
            </div>
            
        </div>


    </div>
  )
}

export default Navbar