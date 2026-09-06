import { assets, doctors as catalog } from "../assets/assets_frontend/assets";
import { bookDemo, changeDemoAppointment } from "./demo-state";
const KEY="prescripto-portfolio-demo-v1";
const initial = () => ({profile:{name:"Demo Visitor",email:"visitor@example.com",phone:"000 000 0000",address:{line1:"123 Example Street",line2:"Sample City"},gender:"Female",dateOfBirth:"1995-01-01",image:assets.profile_pic},appointments:[]});
export function readDemo() {
  try { const state=JSON.parse(localStorage.getItem(KEY)); if(state?.profile && Array.isArray(state.appointments)) return state; } catch { /* use clean initial data */ }
  return initial();
}
export function saveDemo(state) {localStorage.setItem(KEY,JSON.stringify(state));}
export function resetDemo() { localStorage.removeItem(KEY); }
export function demoDoctors(state) {
  return catalog.map(doc=>{const slot_booked={}; for(const item of state.appointments.filter(a=>a.docId===doc._id&&!a.cancelled)){(slot_booked[item.slotDate]??=[]).push(item.slotTime);} return {...doc,about:`Sample ${doc.speciality.toLowerCase()} profile with ${doc.experience.toLowerCase()} of listed experience. Choose a time below to explore the appointment workflow.`,available:state.availability?.[doc._id]??true,slot_booked};});
}
export async function demoAdapter(config) {
  const state=readDemo(); const path=new URL(config.url,window.location.origin).pathname;
  let input=config.data;
  if(typeof input==='string') input=JSON.parse(input);
  let data={success:true};
  try {
    if(path.endsWith('/doctors/list')) data.doctors=demoDoctors(state);
    else if(path.endsWith('/get-profile')) data.userData=state.profile;
    else if(path.endsWith('/appointments')) data.appointments=state.appointments;
    else if(path.endsWith('/book-appointment')) { bookDemo(state,demoDoctors(state),input); data.message="Demo appointment booked. No real consultation is scheduled."; saveDemo(state); }
    else if(path.endsWith('/cancel-appointment')) { changeDemoAppointment(state,input.appointmentId,'cancel'); saveDemo(state); data.message="Demo appointment cancelled."; }
    else if(path.endsWith('/create-payment')) { changeDemoAppointment(state,input.appointmentId,'pay'); saveDemo(state); data.message="Demo payment recorded. No money was charged."; data.demo=true; }
    else if(path.endsWith('/update-profile')) {
      const fields=Object.fromEntries(input.entries());
      if(!String(fields.name||'').trim()) throw new Error("Please enter a name.");
      state.profile={...state.profile,name:fields.name,phone:fields.phone,address:JSON.parse(fields.address),gender:fields.gender,dateOfBirth:fields.dateOfBirth};
      if(fields.image instanceof File && fields.image.size) {
        if(!fields.image.type.startsWith('image/') || fields.image.size>2*1024*1024) throw new Error("Choose an image smaller than 2 MB.");
        state.profile.image=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsDataURL(fields.image);});
      }
      saveDemo(state); data.message="Demo profile saved in this browser.";
    } else if(path.endsWith('/login') || path.endsWith('/register')) data.token="demo-session";
    else throw new Error("This action is unavailable in the portfolio demo.");
  } catch(error) {data={success:false,message:error.message};}
  return {data,status:200,statusText:"OK",headers:{},config};
}
