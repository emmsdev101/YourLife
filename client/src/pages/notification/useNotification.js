import {useEffect, useState} from 'react'
import axios from 'axios'
function useNotification(setRenderHeader) {
    const my_api = process.env.NODE_ENV === "development" ? "http://localhost:4000" : "";

    const [notifications, setNotifications] = useState(null)
    const [viewNotification, setViewNotification] = useState(null)

    useEffect(()=>{
        async function initNotifications(){
            const getNotifications = await axios({
                method: "get",
                withCredentials: true,
                headers: { "Content-Type": "application/json" },
                url: my_api + "/notification",
            })
            setNotifications(getNotifications.data)
        }
        initNotifications()
    },[])
    function closePost(){
        setViewNotification(null)
        setRenderHeader(true)
    }

    return {notifications,viewNotification, setViewNotification,closePost}


}
export default useNotification