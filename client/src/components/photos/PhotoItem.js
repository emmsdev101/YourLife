import React, { useEffect, useState } from 'react';
import style from './photos.module.css'
const PhotoItem = ({viewPhoto, src, index}) => {
    const my_api =
  process.env.NODE_ENV === "development" ? "http://localhost:4000" : "";
    const [photoUrl, setPhotoUrl] = useState(null)

    useEffect(() => {
        const photo_url = my_api + "/photo/" +src
        let image = new Image()
        image.onload = () => {
            setPhotoUrl(photo_url)
        }
        image.src = photo_url
    }, []);
    const view = () => {
        viewPhoto(index)
    }
    return (
        photoUrl? <img className = {style.photoItem} src = {photoUrl} onClick = {view}/>:''
    );
}

export default PhotoItem;
