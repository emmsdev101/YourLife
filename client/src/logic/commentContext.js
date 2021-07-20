import React, {useState, createContext} from 'react'
export const GlobalCommentContext = createContext()
export const GlobalCommentAction = createContext()  

function CommentContext(props){
    const [postToComment, setPostToComment] = useState(null)
    return(
        <GlobalCommentContext.Provider value = {postToComment}>
             <GlobalCommentAction.Provider value = {setPostToComment}>
                {props.children}
             </GlobalCommentAction.Provider>
        </GlobalCommentContext.Provider>
    )
}
export default CommentContext