import appointmentModel from "../models/appointmentModel.js";
import doctorModel from "../models/doctorModel.js";
export function validateSlot(slotDate,slotTime) {
  if(typeof slotDate!=="string"||!/^\d{1,2}-\d{1,2}-\d{4}$/.test(slotDate)||typeof slotTime!=="string"||!/^(0[1-9]|1[0-2]):(00|30) (AM|PM)$/.test(slotTime)) throw new Error("Choose a valid appointment date and time.");
  const [day,month,year]=slotDate.split('-').map(Number);const date=new Date(year,month-1,day);
  if(date.getDate()!==day||date.getMonth()!==month-1||date.getFullYear()!==year)throw new Error("Invalid appointment date.");
  const hour=Number(slotTime.slice(0,2))%12+(slotTime.endsWith('PM')?12:0);
  if(hour<10||hour>=21)throw new Error("Choose a time during clinic hours.");
  return `slot_booked.${slotDate}`;
}
export async function cancelBooking(id,owner) {
  const item=await appointmentModel.findOneAndUpdate({_id:id,...owner,cancelled:false,isCompleted:false},{$set:{cancelled:true}},{new:true});
  if(!item)return false;
  const path=validateSlot(item.slotDate,item.slotTime);
  await doctorModel.updateOne({_id:item.docId},{$pull:{[path]:item.slotTime}});
  return true;
}
