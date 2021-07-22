import { useEffect } from "react";
import { useContext } from "react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import Cookies from "universal-cookie";
import useFeed from "../../logic/useFeed";
import { GlobalUserActionsContext } from "../../logic/userContext";
const useHome = (setRenderHeader) => {
    const username = new Cookies().get('username')
    const [createPost, setCreatePost] = useState(false);
    const [view, setView] = useState(null)
    const history = useHistory()
    const set_user_context = useContext(GlobalUserActionsContext)
    useEffect(() => {
        set_user_context(username)
    }, []);

    const viewPost = (post_id) => {
        setView(post_id)
        if(post_id)setRenderHeader(false)
        else setRenderHeader(true)
    }
    
    const createStory = ()=>{
        if(createPost){
            setCreatePost(false)
        }else{
            setCreatePost(true)
        }
    }
    return {
        createStory,
        createPost,
        viewPost,
        view
    }
}
export default useHome