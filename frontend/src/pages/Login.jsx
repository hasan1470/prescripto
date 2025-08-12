import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

const Login = () => {

  const {backendUrl, token, setToken} = useContext(AppContext)

  const [state, setState] = useState('Sign Up')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      if (state === 'Sign Up') {
        const {data} = await axios.post(`${backendUrl}/api/user/register`, {name, email, password});
        if (data.success) {
          localStorage.setItem('token', data.token);
          setToken(data.token);
        } else {
          toast.error(data.message);
        }
      } else {
        const {data} = await axios.post(`${backendUrl}/api/user/login`, {email, password});
        if (data.success) {
          setToken(data.token);
          localStorage.setItem('token', data.token);
        } else {
          toast.error(data.message);
        }
      }
      
      
    } catch (error) {
      console.error(error);
      toast.error(error.message);

  }
  }

  useEffect(() => {
    if (token) {
      window.location.href = '/';
    }
}, [token]);

  return (
    <form onSubmit={handleSubmit} className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-gray-500 text-sm shadow-lg'>
        <p className='text-2xl font-semibold'>{state === 'Sign Up' ? 'Create Account' : 'Login'}</p>
        <p>Please {state === 'Sign Up' ? 'Create Account' : 'Log in'} to book appointment</p>
        {
          state === 'Sign Up' && 
          <div className='w-full'>
            <p>Full Name</p>
            <input
              type='text' 
              placeholder='' 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required
              className='border border-gray-200 rounded w-full p-2 mt-1' />
          </div>
        }
        <div className='w-full'>
          <p>Email</p>
          <input
            type='email' 
            placeholder='' 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required
            className='border border-gray-200 rounded w-full p-2 mt-1' />
        </div>
        <div className='w-full'>
          <p>Password</p>
          <input
            type='password' 
            placeholder='' 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required
            className='border border-gray-200 rounded w-full p-2 mt-1' />
        </div>
        <button type='submit' className='bg-primary text-white w-full py-2 my-2 rounded-md text-base cursor-pointer'>{state === 'Sign Up' ? 'Create Account' : 'Login'}</button>
        {
          state === 'Sign Up' ? 
            <p className='text-sm'>Already have an account? <span onClick={() => setState('Login')} className='text-primary cursor-pointer'>Login Here</span></p> 
            : 
            <p className='text-sm'>Don't have an account? <span onClick={() => setState('Sign Up')} className='text-primary cursor-pointer'>Sign Up Here</span></p>
        }
      </div>
      
    </form>
  )
}

export default Login