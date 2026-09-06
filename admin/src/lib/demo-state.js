export const DEMO_KEY = 'prescripto-admin-demo-v1';
export function initialAdminState(now = new Date()) {
  const names = ['Richard James', 'Emily Larson', 'Sarah Patel', 'Christopher Lee', 'Jennifer Garcia', 'Andrew Williams'];
  const specialties = ['General physician','Gynecologist','Dermatologist','Pediatricians','Neurologist','Gastroenterologist'];
  const doctors = names.map((name,i)=>({_id:`doc${i+1}`,name:`Dr. ${name}`,image:`/demo/doc${i+1}.png`,email:`doctor${i+1}@example.com`,speciality:specialties[i],degree:'MBBS',experience:`${i+3} Years`,fees:50+i*10,available:true,address:{line1:'123 Example Street',line2:'Sample City'},about:'Fictional profile for exploring the clinic dashboard.'}));
  const appointments = Array.from({length:8},(_,i)=>{
    const date=new Date(now); date.setDate(date.getDate()+i%3);
    const docData=doctors[i%doctors.length];
    return {_id:`sample-${i+1}`,docId:docData._id,userId:`patient-${i%5}`,docData,userData:{name:['Alex Morgan','Sam Taylor','Jamie Lee','Robin Park','Casey Allen'][i%5],image:'/demo/profile_pic.png',dateOfBirth:'1994-03-10'},amount:docData.fees,slotDate:`${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`,slotTime:`${10+i%3}:00 AM`,cancelled:i===6,isCompleted:i===7,payment:i%2===0};
  });
  return {doctors,appointments};
}
export function demoLogin(role, username, password) {
  const expected=role==='admin'?'admin':'doctor';
  if(username.trim()!==expected || password!==expected) throw new Error(`Use ${expected} / ${expected} to enter the demo.`);
  return `portfolio-${expected}`;
}
export function updateAppointment(state,id,action,docId) {
  const item=state.appointments.find(a=>a._id===id && (!docId || a.docId===docId));
  if(!item) throw new Error('Appointment not found.');
  if(item.cancelled || item.isCompleted) throw new Error('This appointment is already closed.');
  if(action==='complete') item.isCompleted=true; else item.cancelled=true;
}
export function dashboard(state,docId) {
  const items=state.appointments.filter(a=>!docId || a.docId===docId);
  return {doctors:state.doctors.length,appointments:items.length,patients:new Set(items.map(a=>a.userId)).size,earnings:items.filter(a=>a.isCompleted || (a.payment&&!a.cancelled)).reduce((sum,a)=>sum+a.amount,0),latestAppointments:items.slice().reverse().slice(0,6)};
}
