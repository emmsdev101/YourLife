import React from 'react'
import style from './progress.module.css'
const UploadingProgress = ({uploadingProgress}) => {
    return (
      <div className={style.uploadingMenu}>
        <div className={style.uploadingView}>
          <h3>Uploading</h3>
          <progress
            className={style.uploadingDp}
            value={uploadingProgress}
            max="100"
          >
            {" "}
          </progress>
          <h3>{uploadingProgress}%</h3>
        </div>
      </div>
    );
  };
  export default UploadingProgress