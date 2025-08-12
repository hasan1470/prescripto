import { createContext } from "react";


export const AppContext = createContext()

const AppContextProvider = ( props ) => {

 const calculateAge = (dateOfBirth) => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);

  let age = today.getFullYear() - birthDate.getFullYear();

  // Check if birthday has occurred this year yet
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--; // birthday not reached yet this year, subtract 1
  }
  return age;
 }

  const months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('-') 
    return dateArray[0]+ ' ' + months[Number(dateArray[1])] + ' ' + dateArray[2]
  }
  const currencySymbol = ["$", "€", "£", "₹"]




    const value = {

      calculateAge,
      slotDateFormat,
      currencySymbol

        
        
    }




  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  )
}

export default AppContextProvider;