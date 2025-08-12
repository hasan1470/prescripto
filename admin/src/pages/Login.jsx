import React, { useState, useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import axios from "axios";
import { toast } from "react-toastify";
import { DoctorContext } from "../context/DoctorContext";


const Login = () => {
  const [state, setState] = useState("Admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setAToken, backendUrl } = useContext(AdminContext);
  const { setDToken } = useContext(DoctorContext);

  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      if ( state === "Admin" ) {

        const {data} = await axios.post(backendUrl + '/api/admin/login', {email, password})
        if (data.success) {
          setAToken(data.token);
          localStorage.setItem("aToken", data.token);
          window.location.href = "/admin-dashboard/";
        } else {
          toast.error(data.message || "Login failed");
        }
    } else {
        const {data} = await axios.post(backendUrl + '/api/doctors/login', {email, password})
        if (data.success) {
          setDToken(data.token);
          localStorage.setItem("dToken", data.token);
          window.location.href = "/doctor-dashboard/";
        } else {
          toast.error(data.message || "Login failed");
        }
    }

    } catch (error) {
      console.error("Login error:", error);
    }



  }


  return (
    <form onSubmit={handleLogin} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border border-blue-100 rounded-xl text-gray-600 text-sm shadow-lg">
        <p className="text-2xl font-semibold m-auto">
          <span className="text-primary">{state}</span> Login
        </p>
        <div className="w-full">
          <p>Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            type="email"
            placeholder=""
            required
          />
        </div>
        <div className="w-full">
          <p>Password</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            type="password"
            placeholder=""
            required
          />
        </div>
        <button className="bg-primary text-white w-full py-2 rounded-md text-base cursor-pointer">
          Login
        </button>
        {state === "Admin" ? (
          <p className="text-xs text-gray-500 mt-2">
            Doctor Login{" "}
            <span
              className="text-primary cursor-pointer underline"
              onClick={() => setState("Doctor")}
            >
              Click Here
            </span>
          </p>
        ) : (
          <p className="text-xs text-gray-500 mt-2">
            Admin Login{" "}
            <span
              className="text-primary cursor-pointer underline"
              onClick={() => setState("Admin")}
            >
              Click Here
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
