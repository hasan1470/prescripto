import { DEMO_MODE } from "./lib/demo-mode";
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import DemoDesk from './pages/DemoDesk.jsx'
import Home from './pages/Home.jsx'
import Doctors from './pages/Doctors.jsx'
import Contact from './pages/Contact.jsx'
import About from './pages/About.jsx'
import Login from './pages/Login.jsx'
import MyAppointments from './pages/MyAppointments.jsx'
import MyProfile from './pages/MyProfile.jsx'
import Appointment from './pages/Appointment.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import { ToastContainer } from 'react-toastify';


const App = () => {
  return (
    <div className='mx-4 sm:mx-[10%]'>

      <ToastContainer />

      {DEMO_MODE && <div className="rounded-b-xl bg-indigo-50 px-4 py-3 text-center text-sm text-indigo-900">Portfolio demo · Book, pay, and cancel using sample data. Nothing is sent to a clinic and no money is charged. <a className="ml-2 underline" href="/my-appointments">My appointments</a> <a className="ml-2 underline" href="/demo-desk">Demo staff desk</a></div>}
      <Navbar />

      <Routes>

        <Route path='/' element={<Home />} />
        <Route path='/doctors' element={<Doctors />} />
        <Route path='/doctors/:speciality' element={<Doctors />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/about' element={<About />} />
        <Route path='/login' element={<Login />} />
        <Route path='/my-appointments' element={<MyAppointments />} />
        <Route path='/appointment/:docID' element={<Appointment />} />
        <Route path='/my-profile' element={<MyProfile />} />

        <Route path='/demo-desk' element={<DemoDesk/>} />
        <Route path='*' element={<div className="py-16 text-center"><h1 className="text-3xl font-semibold">Page not found</h1><a className="mt-4 inline-block underline" href="/doctors">Browse doctors</a></div>} />
      </Routes>

      <Footer />


    </div>
  )
}

export default App