import test from 'node:test';
import assert from 'node:assert/strict';
import {initialAdminState,demoLogin,updateAppointment,dashboard} from '../src/lib/demo-state.js';
test('demo login is explicitly scoped to the chosen role',()=>{
  assert.equal(demoLogin('admin','admin','admin'),'portfolio-admin');
  assert.throws(()=>demoLogin('admin','doctor','doctor'));
  assert.throws(()=>demoLogin('doctor','admin','admin'));
});
test('doctor actions cannot change another doctor appointment or reopen closed records',()=>{
  const state=initialAdminState();
  assert.throws(()=>updateAppointment(state,'sample-2','complete','doc1'));
  updateAppointment(state,'sample-1','complete','doc1');
  assert.throws(()=>updateAppointment(state,'sample-1','cancel'));
  assert.equal(dashboard(state,'doc1').latestAppointments.find(a=>a._id==='sample-1').isCompleted,true);
});
