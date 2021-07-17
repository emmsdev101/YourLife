import React, {useState, createContext} from 'react'
import usePeople from './usePeople'
export const GlobalUserContext = createContext()
export const GlobalUserActionsContext = createContext()  

function UserContext(props){
    const [user, setUser] = useState({})
    const {getUserInfo} = usePeople()

    const setupUser = async(username) => {
        const user_info = await getUserInfo(username)
        if(user_info === null){
            return false;
        }else{
            setUser(user_info)
            return true
        }
    }
    return(
        <GlobalUserContext.Provider value = {user}>
             <GlobalUserActionsContext.Provider value = {setupUser}>
                {props.children}
             </GlobalUserActionsContext.Provider>
        </GlobalUserContext.Provider>
    )
}
export default UserContext