import React, {useEffect, useState, useContext, createContext} from 'react'
import Cookies from 'universal-cookie'


export const GlobalUserContext = createContext()
export const GlobalUserActionsContext = createContext()  

function UserContext(props){
    const [user, setUser] = useState({})

    return(
        <GlobalUserContext.Provider value = {user}>
             <GlobalUserActionsContext.Provider value = {setUser}>
                {props.children}
             </GlobalUserActionsContext.Provider>
        </GlobalUserContext.Provider>
    )
}
export default UserContext