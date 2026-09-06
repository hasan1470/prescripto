import { DEMO_MODE } from "../lib/demo-mode";
import { useCallback, useEffect, useState } from "react";
import axios from "../lib/api";
import { toast } from "react-toastify";

import { AppContext } from "./app-context";

const AppContextProvider = (props) => {

    const currencySymbol = ["$", "€", "£", "₹"]
    const backendUrl = import.meta.env.VITE_BACKEND_URL || ""
    const [doctors, setDoctors] = useState([])
    const [token, setToken] = useState(DEMO_MODE ? 'demo-session' : localStorage.getItem('token') || '');
    const [userData, setUserData] = useState(false);


    const getDoctorsData = useCallback(async () => {
        try { 
            const {data} = await axios.get(`${backendUrl}/api/doctors/list`);
            if (data.success) {
                setDoctors(data.doctors);
            } else {
                toast.error(data.message);
            }
        }
        catch (error) {
            console.error(error)
            toast.error(error.message)
        }

    }, [backendUrl])

    const loadUserData = useCallback(async () => {

        try { 

            const {data} = await axios.get(`${backendUrl}/api/user/get-profile`, {
                headers: {token}})

            if (data.success) {
                setUserData(data.userData);
            } else {
                toast.error(data.message || "Unable to load your profile.");
            }


        } catch (error) {
            console.error(error);
            toast.error( error.message);
        }

    }, [backendUrl, token])
    
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(response => response, error => {
      if (error.response?.status === 401 && error.config?.headers?.get?.("token") === token) {
        localStorage.removeItem("token");
        setToken("");
      }
      return Promise.reject(error);
    });
    return () => axios.interceptors.response.eject(interceptor);
  }, [token]);

    const value = {

        doctors,
        currencySymbol,
        token, 
        setToken,
        backendUrl,
        userData,
        setUserData,
        loadUserData,
        getDoctorsData,
        
    }



    useEffect (() => {
        getDoctorsData();
    }, [getDoctorsData]);

    useEffect (() => {
        if (token) {
            loadUserData();
        } else {
            setUserData(false);
        }
    }, [token, loadUserData]);



    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider;