import { useEffect, useState } from "react";
import useFeed from "../../logic/useFeed";
import usePeople from "../../logic/usePeople";
import testImage1 from "./../../res/images/test1.jpg";
const usePhotos = (back) => {
   const {fetchPhotos} = usePeople()
    const [view, setView] = useState(null)
   const [photos, sePhotos] = useState(null)
   const [loading, setLoading] = useState(true)

   useEffect(() => {
    reqeustPhotos()
       
   }, []);

   const reqeustPhotos = async() => {
       const fetched_photos = await fetchPhotos()
       if(Array.isArray(fetched_photos)){
            sePhotos(fetched_photos)
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
