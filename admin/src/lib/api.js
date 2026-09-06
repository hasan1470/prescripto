import axios from 'axios';
import { DEMO_KEY, initialAdminState, demoLogin, updateAppointment, dashboard } from './demo-state.js';
export const DEMO_MODE=import.meta.env.VITE_DEMO_MODE!=='false';
export const VISITOR_URL=import.meta.env.VITE_VISITOR_URL || 'https://prescripto-doctorbooking.vercel.app';
export const sessionToken=(key)=>{const token=localStorage.getItem(key)||'';return DEMO_MODE ? (token===`portfolio-${key==='aToken'?'admin':'doctor'}`?token:'') : (token.startsWith('portfolio-')?'':token);};
let queue=Promise.resolve();
async function demoAdapter(config) {
  let data;
  try {
    const path=new URL(config.url,window.location.origin).pathname;
    let input=typeof config.data==='string'?JSON.parse(config.data):config.data || {};
    if(path.endsWith('/login')) {
      data={success:true,token:demoLogin(path.includes('/admin/')?'admin':'doctor',input.email,input.password)};
    } else {
      const admin=config.headers?.get?.('aToken')==='portfolio-admin';
      const doctor=config.headers?.get?.('dToken')==='portfolio-doctor';
      if((path.includes('/admin/')&&!admin) || (path.includes('/doctors/')&&!doctor)) throw new Error('Sign in to the demo first.');
      const stored=localStorage.getItem(DEMO_KEY);
      const state=stored?JSON.parse(stored):initialAdminState();
      const docId=path.includes('/doctors/')?'doc1':undefined;
      data={success:true};
      let changed=false;
      if(path.endsWith('/all-doctors')) data.doctors=state.doctors;
      else if(path.endsWith('/appointments') || path.endsWith('/doctor-appointments')) data.appointments=state.appointments.filter(a=>!docId||a.docId===docId).slice().reverse();
      else if(path.endsWith('/dashboard') || path.endsWith('/doctor-dashboard')) data.dashData=dashboard(state,docId);
      else if(path.endsWith('/doctor-profile')) data.profileData=state.doctors.find(d=>d._id===docId);
      else if(path.endsWith('/change-availability')) {
        const doc=state.doctors.find(d=>d._id===input.docId); if(!doc) throw new Error('Doctor not found.');
        doc.available=!doc.available; changed=true; data.message='Availability updated in this demo.';
      } else if(path.endsWith('/appointment-cancel') || path.endsWith('/cancel-appointment') || path.endsWith('/complete-appointment')) {
        updateAppointment(state,input.appointmentId,path.endsWith('/complete-appointment')?'complete':'cancel',docId);
        changed=true; data.message='Demo appointment updated.';
      } else if(path.endsWith('/doctor-update')) {
        const fees=Number(input.fees); if(!Number.isFinite(fees)||fees<=0) throw new Error('Enter a valid positive fee.');
        const doc=state.doctors.find(d=>d._id===docId); Object.assign(doc,{fees,address:input.address,available:Boolean(input.available)});
        changed=true; data.message='Demo profile updated.';
      } else if(path.endsWith('/add-doctor')) {
        input=Object.fromEntries(input.entries());
        if(!input.name?.trim() || !input.speciality || !input.experience || !Number.isFinite(Number(input.fees)) || Number(input.fees)<=0) throw new Error('Complete the name, specialty, experience and positive fee.');
        if(state.doctors.some(d=>d.email===input.email)) throw new Error('This demo email already belongs to a doctor.');
        const file=input.image;
        if(!(file instanceof File) || !['image/png','image/jpeg','image/webp'].includes(file.type)||file.size>1024*1024) throw new Error('Choose a PNG, JPEG or WebP image under 1 MB.');
        const image=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(new Error('Could not read this image.'));reader.readAsDataURL(file);});
        state.doctors.push({_id:crypto.randomUUID(),name:input.name.trim(),email:input.email,experience:input.experience,fees:Number(input.fees),speciality:input.speciality,degree:input.degree,phone:input.phone,address:JSON.parse(input.address),about:input.about,image,available:true});
        changed=true; data.message='Doctor added to this browser’s demo. No account or password was created.';
      } else throw new Error('This demo action is unavailable.');
      if(changed || !stored) localStorage.setItem(DEMO_KEY,JSON.stringify(state));
    }
  } catch(error) {data={success:false,message:error.message};}
  return {data,status:200,statusText:'OK',headers:{},config};
}
const api=axios.create(DEMO_MODE?{adapter:config=>{const task=queue.then(()=>demoAdapter(config));queue=task.catch(()=>{});return task;}}:{});
export default api;
