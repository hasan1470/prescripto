import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { DEMO_MODE } from "../lib/demo-mode";
import { readDemo, saveDemo, demoDoctors } from "../lib/demo-api";
import { changeDemoAppointment } from "../lib/demo-state";
import { AppContext } from "../context/app-context";
import { toast } from "react-toastify";

export default function DemoDesk(){
  const [state,setState]=useState(readDemo);
  const [filter,setFilter]=useState('all');
  const { getDoctorsData }=useContext(AppContext);
  if(!DEMO_MODE)return <p className="py-12">The sample staff desk is available in demo mode only.</p>;
  const doctors=demoDoctors(state);
  const bookings=state.appointments.filter(a=>filter==='all'||a.docId===filter);
  const upcoming=bookings.filter(a=>!a.cancelled&&!a.isCompleted);
  function action(id,type){try{const next=structuredClone(state);changeDemoAppointment(next,id,type);saveDemo(next);setState(next);getDoctorsData();}catch(error){toast.error(error.message);}}
  function toggle(){const next=structuredClone(state);next.availability??={};next.availability[filter]=!(next.availability[filter]??true);saveDemo(next);setState(next);getDoctorsData();}
  return <main className="py-8"><h1 className="text-3xl font-semibold">Demo staff desk</h1><p className="mt-2 text-gray-500">Try the clinic workflow using this browser's sample bookings.</p><div className="my-6 grid gap-4 sm:grid-cols-3">{[['Bookings',bookings.length],['Upcoming',upcoming.length],['Completed',bookings.filter(a=>a.isCompleted).length]].map(([label,value])=><div className="rounded-xl border p-5" key={label}><p className="text-gray-500">{label}</p><p className="mt-2 text-3xl font-semibold">{value}</p></div>)}</div><div className="mb-6 flex flex-wrap items-center gap-4"><label>Doctor <select className="ml-2 rounded-lg border p-2" value={filter} onChange={e=>setFilter(e.target.value)}><option value="all">All doctors</option>{doctors.map(doc=><option key={doc._id} value={doc._id}>{doc.name}</option>)}</select></label>{filter!=='all'&&<button className="rounded-lg border px-4 py-2" onClick={toggle}>{state.availability?.[filter]===false?'Resume bookings':'Pause bookings'}</button>}<Link className="underline" to="/doctors">Book as a visitor</Link></div>{bookings.length===0?<p className="rounded-xl bg-indigo-50 p-8">No sample bookings for this view. Book an appointment to see it here.</p>:<div className="space-y-4">{bookings.map(item=><article key={item._id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border p-5"><div><h2 className="font-semibold">{item.docData.name}</h2><p className="text-sm text-gray-500">{item.userData.name} · {item.slotDate} · {item.slotTime}</p><p className="mt-2 text-sm">{item.cancelled?'Cancelled':item.isCompleted?'Completed':'Upcoming'} · {item.payment?'Demo payment recorded':'Unpaid'}</p></div>{!item.cancelled&&!item.isCompleted&&<div className="flex gap-3"><button className="rounded-full bg-primary px-4 py-2 text-white" onClick={()=>action(item._id,'complete')}>Mark complete</button><button className="rounded-full border px-4 py-2" onClick={()=>action(item._id,'cancel')}>Cancel booking</button></div>}</article>)}</div>}</main>;
}
