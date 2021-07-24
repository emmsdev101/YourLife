import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import style from "./photos.module.css";
import usePhotos from "./usePhotos";
import ViewPhoto from "./ViewPhoto";
import PhotoItem from "./PhotoItem";
import Loader from "../Loader/Loader";
const Photos = ({ back }) => {
  const { view, viewPhoto, photos, close, loading } = usePhotos(back);

  if (view!==null) return <ViewPhoto photos={photos} index={view} back = {viewPhoto} />;
  return (
    <div class={style.photos}>
      <div className={style.header}>
        <div className={style.back} onClick={close}>
          <FaArrowLeft className={style.backIcon} />
        </div>
        <div className={style.photosCount}>
          <h3>100</h3>
          <h3>Photos</h3>
        </div>
      </div>
      {loading ? (
        <div className={style.loader}>
          <Loader />
        </div>
      ) : (
        <div className={style.photosList}>
          {photos
            ? photos.map((photo, idx) => (
                <PhotoItem src={photo.path} index = {idx} viewPhoto={viewPhoto} key = {idx}  />
              ))
            : ""}
        </div>
      )}
    </div>
  );
};

export default Photos;
