import { useEffect } from "react";
import { useContext } from "react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import Cookies from "universal-cookie";
import useFeed from "../../logic/useFeed";
import { GlobalUserActionsContext } from "../../logic/userContext";
const useHome = (setRenderHeader, setFeeds, page, setPage) => {
    const username = new Cookies().get('username')
    const [createPost, setCreatePost] = useState(false);
    const [view, setView] = useState(null)
    const [isLoading, setLoading]= useState(false)
    const history = useHistory()
    const set_user_context = useContext(GlobalUserActionsContext)
    const { fetchFeeds } = useFeed();
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
    const loadMore = async()=>{
        setLoading(true)
        const newFeeds = await fetchFeeds(page)
        setPage(page+1)
        if(newFeeds){
            setFeeds((olds)=>[...olds, ...newFeeds])
            setLoading(false)
        } 
    }
    return {
        createStory,
        createPost,
        viewPost,
        view,
        isLoading,
        loadMore
    }
}
export default useHome