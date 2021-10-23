import {useEffect, useState} from 'react'
import axios from 'axios'
function useNotification(setRenderHeader, notifications, setNotifications) {
    const my_api =
    process.env.NODE_ENV === "development" ? "http://localhost:4000" : "";
    const [viewNotification, setViewNotification] = useState(null)
    const [loadingNext, setLoadingNext] = useState(false)
    const [page, setPage] = useState(1)

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
    async function loadMore(){
        setLoadingNext(true)
        const getNotifications = await axios({
            method: "get",
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
            url: my_api + "/notification",
            params:{page:page}
          });
          if(getNotifications){
            if(getNotifications.status === 200){
                if(getNotifications.data){
                    setNotifications(olds => [...olds, ...getNotifications.data]);
                }
            }
            setLoadingNext(false);
          }
          setPage(page+1)
    }

    return {viewNotification, setViewNotification,closePost, readNotification, loadingNext, loadMore}


}
export default useNotification