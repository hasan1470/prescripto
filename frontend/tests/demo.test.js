import test from "node:test";
import assert from "node:assert/strict";
import { getSlots, bookDemo, changeDemoAppointment } from "../src/lib/demo-state.js";
const now=new Date(2026,8,7,11,15);
const doctor={_id:'doc1',name:'Sample Doctor',fees:50,available:true,slot_booked:{}};
const date='7-9-2026';
test('slots are future half-hours and skip fully booked days',()=>{
 const days=getSlots(doctor,now);assert.equal(days.length,7);assert.equal(days[0][0].time,'11:30 AM');
 const blocked={...doctor,slot_booked:{[date]:days[0].map(s=>s.time)}};
 assert.equal(getSlots(blocked,now)[0][0].datetime.getDate(),8);
 assert.deepEqual(getSlots({...doctor,available:false},now),[]);
});
test('booking prevents duplicate slots and snapshots the fee',()=>{
 const state={profile:{name:'Demo'},appointments:[]};const input={docId:'doc1',slotDate:date,slotTime:'12:00 PM',amount:1};
 const item=bookDemo(state,[doctor],input,now);assert.equal(item.amount,50);
 assert.throws(()=>bookDemo(state,[doctor],input,now),/already booked/);
 changeDemoAppointment(state,item._id,'cancel');assert.equal(bookDemo(state,[doctor],input,now).amount,50);
});
test('cancelled or completed demo bookings cannot be paid or reopened',()=>{
 const state={profile:{},appointments:[]};const item=bookDemo(state,[doctor],{docId:'doc1',slotDate:date,slotTime:'12:00 PM'},now);
 changeDemoAppointment(state,item._id,'pay');assert.equal(item.payment,true);
 changeDemoAppointment(state,item._id,'complete');assert.throws(()=>changeDemoAppointment(state,item._id,'cancel'));
 assert.throws(()=>bookDemo(state,[doctor],{docId:'doc1',slotDate:date,slotTime:''},now));
});
