import React, {useState, createContext} from 'react'
export const GlobalPostContext = createContext()
export const GlobalPostAction = createContext()  

function PostContext(props){
    const [postToView, setPostToView] = useState({})
    return(
        <GlobalPostContext.Provider value = {postToView}>
             <GlobalPostAction.Provider value = {setPostToView}>
                {props.children}
             </GlobalPostAction.Provider>
        </GlobalPostContext.Provider>
    )
}
export default PostContext