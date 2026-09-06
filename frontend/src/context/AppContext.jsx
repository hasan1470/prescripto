import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext()

const AppContextProvider = (props) => {

    const currencySymbol = ["$", "€", "£", "₹"]
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [doctors, setDoctors] = useState([])
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [userData, setUserData] = useState(false);


    const getDoctorsData = async () => {
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

    }

    const loadUserData = async () => {

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

    }
    
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
    }, []);

    useEffect (() => {
        if (token) {
            loadUserData();
        } else {
            setUserData(false);
        }
    }, [token]);



    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider;