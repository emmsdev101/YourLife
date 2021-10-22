import {useEffect, useState} from 'react'
import axios from 'axios'
function useNotification(setRenderHeader, notifications, setNotifications) {
    const [viewNotification, setViewNotification] = useState(null)

    useEffect(()=>{
        
    },[])
    function closePost(){
        setViewNotification(null)
        setRenderHeader(true)
    }
    function readNotification(id){
        let notifs = [...notifications]
        notifs[id].seen = true
        setNotifications(notifs)
    }

    return {viewNotification, setViewNotification,closePost, readNotification}


}
export default useNotification