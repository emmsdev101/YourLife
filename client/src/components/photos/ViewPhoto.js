import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaChevronLeft, FaChevronRight, FaEllipsisV } from "react-icons/fa";
import Loader from "../Loader/Loader";
import style from "./photos.module.css";
const ViewPhoto = ({photos, index, back}) => {
  const my_api =
  process.env.NODE_ENV === "development" ? "http://localhost:4000" : "";
  const [onView, setOnView] = useState(null)
  const [photoIndex, setPhotoIndex] = useState(index)

  useEffect(() => {
      const src =my_api + "/photos/" +  photos[photoIndex].path
    let image = new Image()
    image.onload = () => {
      setOnView(src)
    }
    image.src = src
  }, [photoIndex]);

  const close = () => {
    back(null)
  }
  const next = () => {
    setOnView(null)
    let next_index = photoIndex + 1
    if(next_index === photos.length)next_index = 0
    setPhotoIndex(next_index)
  }
  const prev = () => {
    setOnView(null)
    let next_index = photoIndex - 1
    if(next_index < 0)next_index = photos.length - 1
    setPhotoIndex(next_index)
  }
  return (
    <div className={style.viewPhoto}>
      <div className={style.viewHeader}>
        <div className={style.viewBack}>
          <FaArrowLeft className={style.backIcon} onClick = {close}/>
        </div>
        <h3>Photo title</h3>
        <div className = {style.viewMenu}>
          <FaEllipsisV/>
        </div>
      </div>
      <div className = {style.imageContainer}>
        {onView? <img className = {style.image} src = {onView}/>:<Loader/>}
      </div>
      <div className = {style.viewNavigation}>
        <div className = {style.viewNavContainer} onClick = {prev}>
          <FaChevronLeft/>
        </div>
        <div className = {style.viewNavContainer} onClick = {next}>
          <FaChevronRight/>
        </div>
      </div>
    </div>
  );
};

export default ViewPhoto;
