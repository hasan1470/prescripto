import axios from "axios";
import { DEMO_MODE } from "./demo-mode";
import { demoAdapter } from "./demo-api";
export default axios.create(DEMO_MODE ? {adapter:demoAdapter} : {});
