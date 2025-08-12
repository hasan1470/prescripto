import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import {assets} from '../assets/assets_frontend/assets';
import { toast } from 'react-toastify';
import axios from 'axios';

const MyProfile = () => {

  const { userData, setUserData, token, backendUrl, loadUserData } = useContext(AppContext);

  const [isEditing, setIsEditing] = useState(false)
  const [image, setImage] = useState(false);

  const updateProfile = async () => {
    try { 

      const formData = new FormData();
      formData.append('name', userData.name);
      formData.append('phone', userData.phone);
      formData.append('address', JSON.stringify(userData.address));
      formData.append('gender', userData.gender);
      formData.append('dateOfBirth', userData.dateOfBirth);

      image && formData.append('image', image);

      const {data} = await axios.post(`${backendUrl}/api/user/update-profile`, formData, {
        headers: {token}
      });
      if (data.success) {
        toast.success("Profile updated successfully");
        await loadUserData();
        setIsEditing(false);
        setImage(false);
      } else {
        toast.error(data.message || "Error updating profile");
      }

    } catch (error) {
      toast.error(error.message);
    }

  }
  

  return userData && (


    <div className='max-w-lg flex flex-col gap-2 text-sm pt-5'>

      {
        isEditing
        ? <label htmlFor='image'>
          <div className=' inline-block relative cursor-pointer'>
            <img className='w-36 rounded opacity-75' src={image ? URL.createObjectURL(image) : userData.image} alt="" />
            <img className='w-10 absolute bottom-12 right-13' src={image ? '' : assets.upload_icon} alt="" />
          </div>
          <input type='file' id='image' hidden  onChange={(e) => setImage(e.target.files[0])} />
        </label>
        :<img className='w-36 rounded' src={userData.image} alt="" />
      }

      
      {
        isEditing ?
        <input className='bg-gray-200' type='text' value={userData.name} onChange={(e) => setUserData({...userData, name: e.target.value})} />
        :
        <p className='font-medium text-3xl text-gray-800 mt-4'>{userData.name}</p>
      }

      <hr className='bg-gray-100 h-[1px] border-none' />
      <div>
        <p className='text-gray-600 underline mt-3'>Contact Information</p>
        <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-gray-600'>
          <p className='font-medium'>Email:</p>  
          <p className='text-blue-500'>{userData.email}</p>
          <p className='font-medium'>Phone:</p> 
          {
            isEditing ? 
            <input className='bg-gray-200' type='text' value={userData.phone} onChange={(e) => setUserData({...userData, phone: e.target.value})} />
            :
            <p className='text-blue-500'>{userData.phone}</p>
          }
          
          <p className='font-medium'>Address:</p> 
          {
            isEditing ? 
            <p><input className='bg-gray-200' type='text' value={userData.address.line1} onChange={(e) => setUserData({...userData, address: {...userData.address, line1: e.target.value}})} /> <br /></p>
            :
            <p className='text-gray-500'>{userData.address.line1}</p>
          }
          {
            isEditing ? 
            <p><input className='bg-gray-200' type='text' value={userData.address.line2} onChange={(e) => setUserData({...userData, address: {...userData.address, line2: e.target.value}})} /></p>
            :
            <p className='text-gray-500'>{userData.address.line2}</p>
          }
        </div>
      </div>

      <div>
        <p className='text-gray-600 underline mt-3'>Basic Information</p>
        <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-gray-600'> 
          <p  className='font-medium'>Gender:</p>
          {
            isEditing ? 
            <select className='max-w-20 bg-gray-200' value={userData.gender} onChange={(e) => setUserData({...userData, gender: e.target.value})}>
              <option value="Male" selected>Male</option>
              <option value="Female">Female</option>
            </select>
            :
            <p className='text-gray-500'>{userData.gender}</p>
          }
          <p className='font-medium'>Date of Birth:</p>
          {
            isEditing ? 
            <input className='max-w-28 bg-gray-20 0' type='date' value={userData.dateOfBirth} onChange={(e) => setUserData({...userData, dateOfBirth: e.target.value})} />
            :
            <p className='text-gray-500'> {userData.dateOfBirth}</p>
          }
          
        </div>
      </div>

      <div className='mt-10'>
        {
          isEditing ? 
          <button className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all cursor-pointer' onClick={updateProfile}>Save Information</button>
          :
          <button className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all cursor-pointer' onClick={() => setIsEditing(true)}>Edit Information</button>
        }
      </div>
      



    </div>
  )
}

export default MyProfile