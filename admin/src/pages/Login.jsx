import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminContext } from '../context/AdminContext';
import { DoctorContext } from '../context/DoctorContext';
import api, { DEMO_MODE, VISITOR_URL } from '../lib/api';
import { toast } from 'react-toastify';

export default function Login(){
  const [role,setRole]=useState('Admin');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [busy,setBusy]=useState(false);
  const {setAToken,backendUrl}=useContext(AdminContext);
  const {setDToken}=useContext(DoctorContext);
  const navigate=useNavigate();
  async function login(event){
    event.preventDefault();setBusy(true);
    try {
      const admin=role==='Admin';
      const {data}=await api.post(`${backendUrl}/api/${admin?'admin':'doctors'}/login`,{email,password});
      if(!data.success) throw new Error(data.message||'Unable to sign in.');
      localStorage.removeItem(admin?'dToken':'aToken');
      localStorage.setItem(admin?'aToken':'dToken',data.token);
      setAToken(admin?data.token:'');setDToken(admin?'':data.token);
      navigate(admin?'/admin-dashboard':'/doctor-dashboard');
    } catch(error){toast.error(error.message||'Unable to sign in.');} finally{setBusy(false);}
  }
  return <main className="min-h-screen bg-slate-50 px-4 py-12 flex items-center justify-center">
    <form onSubmit={login} className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-5">
      <a className="text-primary font-semibold text-sm" href={VISITOR_URL}>← Patient website</a>
      <h1 className="text-3xl font-semibold text-slate-900">{role} dashboard</h1>
      {DEMO_MODE && <div className="rounded-xl bg-indigo-50 p-4 text-sm text-indigo-950"><p className="font-semibold">Explore the portfolio demo</p><p className="mt-2">Username: <strong>{role.toLowerCase()}</strong><br/>Password: <strong>{role.toLowerCase()}</strong></p><p className="mt-2">Try the dashboard with fictional doctors and appointments. Changes stay in this browser.</p><button type="button" className="mt-3 underline font-medium" onClick={()=>{setEmail(role.toLowerCase());setPassword(role.toLowerCase());}}>Fill demo credentials</button></div>}
      <label className="block text-sm font-medium">{DEMO_MODE?'Username':'Email'}<input aria-label={DEMO_MODE?'Username':'Email'} autoComplete="username" value={email} onChange={e=>setEmail(e.target.value)} type={DEMO_MODE?'text':'email'} className="mt-2 w-full border border-slate-300 rounded-lg px-3 py-2.5" required /></label>
      <label className="block text-sm font-medium">Password<input aria-label="Password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} type="password" className="mt-2 w-full border border-slate-300 rounded-lg px-3 py-2.5" required /></label>
      <button disabled={busy} className="w-full bg-primary text-white py-3 rounded-lg font-semibold disabled:opacity-60">{busy?'Opening…':'Open dashboard'}</button>
      <button type="button" className="text-sm underline text-slate-600" onClick={()=>{setRole(role==='Admin'?'Doctor':'Admin');setEmail('');setPassword('');}}>Switch to {role==='Admin'?'doctor':'admin'} login</button>
    </form>
  </main>;
}
