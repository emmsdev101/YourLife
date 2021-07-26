import { useContext, useEffect, useRef } from "react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import Cookies from "universal-cookie";
import useFeed from "./logic/useFeed";
import { GlobalUserActionsContext } from "./logic/userContext";

const cookie = new Cookies()
const username = cookie.get("username")

const useApp = () => {
  const {fetchFeeds} = useFeed()
  const location = useLocation()
  const setUserContext = useContext(GlobalUserActionsContext)
    const [renderHeader, setRenderHeader] = useState(true)
    const [stories, setStories] = useState(null)
    const [loading, setLoading] = useState(true)
    let refreshed = useRef(false)
   

    useEffect(() => {
      if(isLogged()){
        fetchStory()
        setUserContext()
      }
    }, []);
    useEffect(()=>{
      console.log(renderHeader)
    },[renderHeader])
    useEffect(() => {
        const curr_path = location.pathname.substring(1)
        console.log(curr_path)

        if(curr_path  === "viewpost" || curr_path.substring(0, curr_path.indexOf('/')) === "profile" || curr_path === "profile" || curr_path === "chat"){
            setRenderHeader(false)
        }else{
            setRenderHeader(true)
        }
    }, [location.pathname]);
    async function fetchStory(){
      setLoading(true)
      const fetched_stories = await fetchFeeds()
      if(fetched_stories){
        if(Array.isArray(stories)){
          if(refreshed.current)setStories(fetched_stories)
          else setStories((feeds) => [...feeds, ...fetched_stories]);
        }else{
          setStories(fetched_stories)
        }
        setLoading(false)
        refreshed.current = true
      }
    }
    const addFeed = (newFeedPar) => {
      if(Array.isArray(stories)){
        setStories((feeds) => [newFeedPar, ...feeds]);
      }else{
        setStories([].push(newFeedPar));
      }
    }
    function isLogged () {
        if (username !== undefined) {
          return true;
        } else {
          return false;
        }
      };
      return {isLogged,renderHeader, setRenderHeader, stories, addFeed, fetchStory, loading}
}
export default useApp