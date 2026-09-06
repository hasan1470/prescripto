export function getSlots(doctor, now = new Date()) {
  const days = [];
  for (let offset = 0; offset < 9 && days.length < 7; offset++) {
    const date = new Date(now); date.setDate(date.getDate() + offset); date.setHours(10,0,0,0);
    const slotDate = `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`;
    const slots = [];
    while (date.getHours() < 21) {
      const time = date.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit",hour12:true});
      if (date > now && !(doctor.slot_booked?.[slotDate] || []).includes(time)) slots.push({datetime:new Date(date),time});
      date.setMinutes(date.getMinutes()+30);
    }
    if (slots.length && doctor.available) days.push(slots);
  }
  return days;
}
export function bookDemo(state, doctors, input, now = new Date()) {
  const doctor = doctors.find(doc => doc._id === input.docId);
  if (!doctor?.available) throw new Error("Doctor is unavailable.");
  const valid = getSlots(doctor,now).flat().some(slot => `${slot.datetime.getDate()}-${slot.datetime.getMonth()+1}-${slot.datetime.getFullYear()}` === input.slotDate && slot.time === input.slotTime);
  if (!valid) throw new Error("Choose an available future appointment time.");
  if (state.appointments.some(a=>!a.cancelled && a.docId===input.docId && a.slotDate===input.slotDate && a.slotTime===input.slotTime)) throw new Error("This slot is already booked.");
  const appointment = {_id:crypto.randomUUID(),docId:doctor._id,docData:{...doctor},userData:{...state.profile},slotDate:input.slotDate,slotTime:input.slotTime,amount:doctor.fees,date:now.toISOString(),cancelled:false,payment:false,isCompleted:false};
  state.appointments.push(appointment);
  return appointment;
}
export function changeDemoAppointment(state,id,action) {
  const item=state.appointments.find(a=>a._id===id);
  if (!item) throw new Error("Appointment not found.");
  if (item.cancelled || item.isCompleted) throw new Error("This appointment is already closed.");
  if (action==='cancel') item.cancelled=true;
  else if (action==='pay') item.payment=true;
  else if (action==='complete') item.isCompleted=true;
  else throw new Error("Unknown appointment action.");
  return item;
}
