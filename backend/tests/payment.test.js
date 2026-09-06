import test from "node:test";
import assert from "node:assert/strict";
import appointmentModel from "../models/appointmentModel.js";
import { createPayment, verifyPayment } from "../controllers/paymentController.js";
process.env.STRIPE_SECRET_KEY="regression-test-placeholder";
process.env.FRONTEND_URL="https://example.com";
const id="507f1f77bcf86cd799439011";
function response(){return {code:200,status(code){this.code=code;return this},json(body){this.body=body;return this}}}
test("checkout uses the stored fee and trusted redirect origin",async t=>{
  t.mock.method(appointmentModel,'findOne',async()=>({_id:id,amount:50,payment:false,docData:{name:'Sample'}}));
  t.mock.method(appointmentModel,'updateOne',async()=>({}));
  t.mock.method(globalThis,'fetch',async(url,options)=>{
    assert.equal(options.body.get('line_items[0][price_data][unit_amount]'),'5000');
    assert.equal(options.body.get('success_url'),'https://example.com/my-appointments?session_id={CHECKOUT_SESSION_ID}');
    return {ok:true,json:async()=>({id:'cs_test_sample',url:'https://checkout.stripe.com/example'})};
  });
  const res=response();
  await createPayment({userId:'visitor',body:{appointmentId:id,amount:1,origin:'https://untrusted.example'}},res);
  assert.equal(res.body.success,true);
});
test("a paid session belonging to another visitor cannot confirm payment",async t=>{
  t.mock.method(globalThis,'fetch',async()=>({ok:true,json:async()=>({metadata:{appointmentId:id,userId:'other'},payment_status:'paid',currency:'usd',amount_total:5000})}));
  t.mock.method(appointmentModel,'findOne',async()=>({_id:id,amount:50}));
  t.mock.method(appointmentModel,'updateOne',()=>assert.fail('must not mark paid'));
  const res=response();
  await verifyPayment({userId:'visitor',body:{sessionId:'cs_test_sample'}},res);
  assert.equal(res.code,400);
  assert.equal(res.body.success,false);
});
