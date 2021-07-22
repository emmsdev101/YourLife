import React from "react";
import { FaUserCircle } from "react-icons/fa";

function PickerView ({pickedPhoto,profile_photo_url,profilePicLoaded,uploadProfilePic, uploadProfile, closeUpload}) {
    return (
      <React.Fragment>
        <div className="upload-menu-body">
          <h3 className="upload-menu-title">Change Profile Photo</h3>
          {pickedPhoto !== null || profilePicLoaded ? 
            <img
              className="profilepic-preview"
              alt=""
              src={pickedPhoto !== null ? pickedPhoto : profile_photo_url}
            />
           : 
            <div className="temp-profilepic-preview">
              <FaUserCircle className="temp-avatar-prev" />
            </div>
          }
          <div className="upload-menu-header">
            {pickedPhoto !== null ? 
              <div className="upload-picked" onClick={uploadProfilePic}>
                Save
              </div>
             : 
              <React.Fragment>
                <button className="upload" onClick={uploadProfile}>
                  Upload
                </button>
                <button className="upload">Photos</button>
                </React.Fragment>
            }
            <button className="close-upload-menu" onClick={closeUpload}>
              Cancel
            </button>
          </div>
        </div>
        </React.Fragment>
    );
  };
  export default PickerView