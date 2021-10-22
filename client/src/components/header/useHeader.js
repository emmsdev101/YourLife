import { useEffect, useState, useContext,useRef } from "react";
import { useHistory, useLocation } from "react-router-dom";
import axios from "axios"
import {
    GlobalUserContext,
  } from "../../logic/userContext";
const useHeader = (notifications) =>{
    const [active, setActive] = useState("");
    const [newNotifs, setNewNotifs] = useState(0)
    const history = useHistory();
    const location = useLocation()
    const isMounted = useRef(false)

    const user_context = useContext(GlobalUserContext);

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
        countUnread()
    },[notifications])

    const countUnread = ()=>{
        let unReads = 0
        notifications?.forEach(notification => {
            if(!notification.seen)unReads++
        });
        setNewNotifs(unReads)
    }
      
    return {switchPage, setActive, active, newNotifs}
}
export default useHeader