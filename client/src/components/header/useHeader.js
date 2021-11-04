import { useEffect, useState,useRef } from "react";
import { useHistory, useLocation } from "react-router-dom";

const useHeader = (notifications, chats) =>{
    const [active, setActive] = useState("");
    const [newNotifs, setNewNotifs] = useState(0)
    const [newChats, setNewChats] = useState(0)
    const history = useHistory();
    const location = useLocation()
    const isMounted = useRef(false)

    useEffect(() => {
        isMounted.current = true
        if(isMounted.current){
            setActive(location.pathname)
        }
        return () => {
            isMounted.current = false
        };
    }, [location.pathname]);

    function switchPage(page) {
        history.push(page);
      }
      useEffect(()=>{
        isMounted.current = true
        if(isMounted.current){
            setNewNotifs(countUnread(notifications))
        }
        return () => {
            isMounted.current = false
        };
    },[notifications])

    useEffect(() => {
        isMounted.current = true
        if(isMounted.current){
            const unreadChats = countUnread(chats)
            setNewChats(unreadChats)
        }
        return () => {
            isMounted.current = false
        };
    }, [chats])

    const countUnread = (array)=>{
        let unReads = 0
        array?.forEach(arrayItem => {
            if(!arrayItem.seen)unReads++
        });
        return unReads
    }
      
    return {switchPage, setActive, active, newNotifs, newChats}
}
export default useHeader