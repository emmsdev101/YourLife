import React, { useContext, useEffect, useRef, useState } from 'react';
import { GlobalUserContext } from '../../logic/userContext';

const useChangePhoto = () => {
    const my_api =
    process.env.NODE_ENV === "development" ? "http://localhost:4000" : "";
    const user_context = useContext(GlobalUserContext);
    const [upload, setUpload] = useState(false);
    const [profile_photo_url, setProfilePhotoUrl] = useState();

    let  isMounted = useRef(true)

    useEffect(() => {
        let pp = new Image();
        pp.onload = () => {
          if (isMounted.current) {
            setProfilePhotoUrl(my_api + "/photos/" + user_context.photo);
          }
        };
        pp.src = my_api + "/photos/" + user_context.photo;
    
        return () => {
          isMounted.current = false;
        };
      }, [user_context]);

    const uploadEnable = () => {
        setUpload(true);
      };

    return { uploadEnable,
        upload,profile_photo_url, setUpload, setProfilePhotoUrl }
}

export default useChangePhoto;
