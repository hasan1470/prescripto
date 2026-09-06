import { DEMO_MODE, VISITOR_URL } from '../lib/api';
import { DEMO_KEY } from '../lib/demo-state';
export default function AdminDemoNote(){
  if(!DEMO_MODE) return null;
  return <div className="bg-indigo-50 text-indigo-950 px-4 py-3 text-sm text-center">Portfolio workspace · Fictional records saved in this browser. <a href={VISITOR_URL} className="underline ml-2">Visit patient website</a> <button type="button" className="underline ml-3" onClick={()=>{if(window.confirm('Reset the sample doctors and appointments in this admin demo?')) {localStorage.removeItem(DEMO_KEY);window.location.reload();}}}>Reset sample data</button></div>;
}
