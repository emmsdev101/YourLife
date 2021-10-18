import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Cookies from "universal-cookie/es6";
import useFeed from "../../logic/useFeed";
import usePeople from "../../logic/usePeople";

const cookie = new Cookies();
const usePhotos = (back) => {
   const {fetchGalerry} = usePeople()
   const params = useParams()
   const username = cookie.get("username")
   const user = params.username
   const isOwn = user === username || user === undefined

    const [view, setView] = useState(null)
   const [photos, setPhotos] = useState(null)
   const [loading, setLoading] = useState(true)

   useEffect(() => {
       setPhotos(null)
    reqeustPhotos()
   }, [user]);

   const reqeustPhotos = async() => {
    setLoading(true)
       const fetched_photos = await fetchGalerry(isOwn?null:user)
       if(Array.isArray(fetched_photos)){
            setPhotos(fetched_photos)
            setLoading(false)
       }
   }

   const viewPhoto = (url) => {
       setView(url)
   }
   const close = () => {
       back(false)
   }
   return {view, viewPhoto, photos, loading, close}
}

export default usePhotos;
