import { useCallback, useContext, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AppContext } from "../context/app-context";
import api from "../lib/api";
import { DEMO_MODE } from "../lib/demo-mode";
import { toast } from "react-toastify";

export default function MyAppointments() {
  const { backendUrl, token, getDoctorsData } = useContext(AppContext);
  const [appointments,setAppointments]=useState([]);
  const [loading,setLoading]=useState(true);
  const [busy,setBusy]=useState("");
  const [params,setParams]=useSearchParams();
  const load=useCallback(async()=>{
    try {const {data}=await api.get(`${backendUrl}/api/user/appointments`,{headers:{token}});if(!data.success)throw new Error(data.message);setAppointments([...data.appointments].reverse());}
    catch(error){toast.error(error.message);}finally{setLoading(false);}
  },[backendUrl,token]);
  useEffect(()=>{if(token)load();else setLoading(false);},[token,load]);
  useEffect(()=>{
    const sessionId=params.get("session_id");
    if(!DEMO_MODE && token && sessionId){
      api.post(`${backendUrl}/api/user/verify-payment`,{sessionId},{headers:{token}}).then(({data})=>{if(!data.success)throw new Error(data.message);toast.success(data.message);setParams({});load();}).catch(error=>toast.error(error.message));
    }
  },[backendUrl,token,params,setParams,load]);
  async function act(id,action){
    setBusy(id);
    try {
      const {data}=await api.post(`${backendUrl}/api/user/${action}`,{appointmentId:id},{headers:{token}});
      if(!data.success)throw new Error(data.message);
      if(data.url){window.location.assign(data.url);return;}
      toast.success(data.message);await load();getDoctorsData();
    }catch(error){toast.error(error.message);}finally{setBusy("");}
  }
  function exportBookings(){const url=URL.createObjectURL(new Blob([JSON.stringify({demo:DEMO_MODE,appointments},null,2)],{type:"application/json"}));const a=document.createElement('a');a.href=url;a.download='prescripto-appointments.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
  return <main className="py-8"><div className="flex flex-wrap items-center justify-between gap-4 border-b pb-5"><div><h1 className="text-3xl font-semibold">My appointments</h1><p className="mt-2 text-gray-500">{DEMO_MODE?"Sample bookings saved in this browser. No real consultation or charge.":"Manage your upcoming consultations."}</p></div>{appointments.length>0&&<button onClick={exportBookings} className="rounded-full border px-5 py-2">Export bookings</button>}</div>
    {loading?<p className="py-10">Loading appointments…</p>:!token?<p className="py-10"><Link className="underline" to="/login">Sign in to see your appointments</Link></p>:appointments.length===0?<div className="rounded-xl bg-indigo-50 p-10 my-8 text-center"><h2 className="text-xl font-semibold">No appointments yet</h2><p className="my-3">Choose a doctor and an available time to get started.</p><Link className="inline-block rounded-full bg-primary px-6 py-3 text-white" to="/doctors">Find a doctor</Link></div>:appointments.map(item=><article key={item._id} className="flex flex-col gap-5 border-b py-6 sm:flex-row"><img className="h-32 w-32 rounded-xl bg-indigo-50 object-cover" src={item.docData.image} alt={item.docData.name}/><div className="flex-1"><h2 className="text-lg font-semibold">{item.docData.name}</h2><p className="text-gray-500">{item.docData.speciality}</p><p className="my-2 font-medium">{item.slotDate} · {item.slotTime}</p><p className="text-sm text-gray-500">{item.docData.address?.line1} · {item.docData.address?.line2}</p><p className="mt-2">Fee: ${Number(item.amount).toFixed(2)}</p></div><div className="flex flex-col items-stretch justify-center gap-2 sm:min-w-48">{item.cancelled?<span className="rounded-lg bg-red-50 p-3 text-center text-red-700">Cancelled</span>:<><span className="rounded-lg bg-indigo-50 p-3 text-center text-indigo-900">{item.isCompleted?'Completed':item.payment?(DEMO_MODE?'Demo payment recorded':'Payment complete'):'Upcoming'}</span>{!item.payment&&!item.isCompleted&&<button disabled={busy===item._id} onClick={()=>act(item._id,'create-payment')} className="rounded-lg bg-primary p-3 text-white disabled:opacity-50">{DEMO_MODE?'Simulate payment':'Pay online'}</button>}{!item.isCompleted&&<button disabled={busy===item._id} onClick={()=>act(item._id,'cancel-appointment')} className="rounded-lg border p-3 disabled:opacity-50">Cancel appointment</button>}</>}</div></article>)}
  </main>;
}
