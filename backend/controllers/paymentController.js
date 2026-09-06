import appointmentModel from "../models/appointmentModel.js";
import { isValidObjectId } from "mongoose";

async function stripeRequest(path, body, idempotencyKey) {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error("Online payment is not configured. Please contact the clinic.");
  const headers={Authorization:`Bearer ${process.env.STRIPE_SECRET_KEY}`};
  if(body)headers["Content-Type"]="application/x-www-form-urlencoded";
  if(idempotencyKey)headers["Idempotency-Key"]=idempotencyKey;
  const response=await fetch(`https://api.stripe.com/v1/${path}`,{method:body?'POST':'GET',headers,body,signal:AbortSignal.timeout(15000)});
  if(!response.ok)throw new Error("Payment service is unavailable. Please try again later.");
  return response.json();
}
export async function createPayment(req,res){
  try {
    if(!isValidObjectId(req.body.appointmentId))return res.status(400).json({success:false,message:"Invalid appointment."});
    const item=await appointmentModel.findOne({_id:req.body.appointmentId,userId:req.userId,cancelled:false,isCompleted:false});
    if(!item || item.payment)return res.status(400).json({success:false,message:"This appointment cannot be paid."});
    if(!process.env.FRONTEND_URL)throw new Error("The clinic website URL is not configured.");
    const origin=new URL(process.env.FRONTEND_URL).origin;
    const amount=Math.round(item.amount*100);
    if(!Number.isSafeInteger(amount)||amount<50)throw new Error("Invalid appointment fee.");
    // Reuse a still-open session to prevent duplicate charges after repeated clicks.
    if(item.stripeSessionId){const existing=await stripeRequest(`checkout/sessions/${encodeURIComponent(item.stripeSessionId)}`);if(existing.status==='open')return res.json({success:true,url:existing.url});if(existing.payment_status==='paid')return res.status(409).json({success:false,message:"Payment already received. Refresh your appointments to verify it."});}
    const form=new URLSearchParams({mode:'payment','payment_method_types[0]':'card',client_reference_id:String(item._id),'metadata[appointmentId]':String(item._id),'metadata[userId]':req.userId,'line_items[0][quantity]':'1','line_items[0][price_data][currency]':'usd','line_items[0][price_data][unit_amount]':String(amount),'line_items[0][price_data][product_data][name]':`Appointment with ${item.docData.name}`,success_url:`${origin}/my-appointments?session_id={CHECKOUT_SESSION_ID}`,cancel_url:`${origin}/my-appointments`});
    const session=await stripeRequest('checkout/sessions',form,`appointment-${item._id}-${item.stripeSessionId||'initial'}`);
    await appointmentModel.updateOne({_id:item._id},{$set:{stripeSessionId:session.id}});
    res.json({success:true,url:session.url});
  }catch(error){res.status(503).json({success:false,message:error.message});}
}
export async function verifyPayment(req,res){
  try {
    const {sessionId}=req.body;
    if(typeof sessionId!=='string'||!/^cs_[a-zA-Z0-9_]+$/.test(sessionId))return res.status(400).json({success:false,message:"Invalid payment session."});
    const session=await stripeRequest(`checkout/sessions/${encodeURIComponent(sessionId)}`);
    const item=await appointmentModel.findOne({_id:session.metadata?.appointmentId,userId:req.userId,stripeSessionId:sessionId});
    if(!item || session.metadata?.userId!==req.userId || session.payment_status!=='paid' || session.currency!=='usd' || session.amount_total!==Math.round(item.amount*100))return res.status(400).json({success:false,message:"Payment is not confirmed for this appointment."});
    await appointmentModel.updateOne({_id:item._id},{$set:{payment:true}});
    res.json({success:true,message:"Payment verified successfully."});
  }catch(error){res.status(503).json({success:false,message:error.message});}
}
