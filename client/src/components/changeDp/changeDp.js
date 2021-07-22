import React from "react";
import imageCompression from "../../logic/imageCompression";
import { useCustomHooks, useIcons, useReactHooks } from "../../logic/library";
import PickerView from "./UploadPicker";

function ChangeDp({ setUpload, setProfilePhotoUrl, profile_photo_url }) {
  const my_api =
    process.env.NODE_ENV === "development" ? "http://localhost:4000" : "";
  const { useState, useContext, useRef, useEffect } = useReactHooks();
  const { useFeed, usePeople, GlobalUserContext, GlobalUserActionsContext } =
    useCustomHooks();
  let uploadPicker = useRef(null);
  const { uploadDp, uploadingProgress } = useFeed();
  const { updateDp } = usePeople();
  const { getUrlImage } = imageCompression();
  const [pickedPhoto, setPickedPhoto] = useState(null);
  const [profilePicLoaded, setProfilePicLoaded] = useState(false);
  const user_context = useContext(GlobalUserContext);
  const set_user_context = useContext(GlobalUserActionsContext);

  useEffect(() => {
    let dp = new Image();
    dp.onload = () => {
      setProfilePicLoaded(true);
    };
    dp.src = profile_photo_url;
  }, []);

  const uploadProfile = () => {
    uploadPicker.current?.click();
  };
  const closeUpload = () => {
    setUpload(false);
  };
  const pick = async (e) => {
    const picked = e.target.files[0];
    await getUrlImage(picked, setPickedPhoto);
  };
  const uploadProfilePic = async () => {
    const uploadResult = await uploadDp(pickedPhoto);
    if (uploadResult) {
      set_user_context(user_context.username);
      setProfilePhotoUrl(my_api + "/photos/" + uploadResult);
      setUpload(false);
    } else {
      console.log("Error while uploading photo");
    }
  };

  function UploadingView() {
    return (
      <div className="uploading-view">
        <h3>Uploading</h3>
        <progress
          id="uploading-dp"
          value={uploadingProgress}
          max="100"
        ></progress>
        <h3>{uploadingProgress}%</h3>
      </div>
    );
  }
  return (
    <div className="upload-menu">
      <input
        type="file"
        accept="image/*"
        ref={uploadPicker}
        id="image-picker"
        files={pickedPhoto}
        onChange={pick}
        hidden
      />
      {
        (pickedPhoto,
        profile_photo_url,
        profilePicLoaded,
        uploadProfilePic,
        uploadProfile,
        closeUpload)
      }
      {uploadingProgress > 0 ? (
        <UploadingView />
      ) : (
        <PickerView
          profilePicLoaded={profilePicLoaded}
          pickedPhoto={pickedPhoto}
          profile_photo_url={profile_photo_url}
          uploadProfilePic={uploadProfilePic}
          uploadProfile={uploadProfile}
          closeUpload={closeUpload}
        />
      )}
    </div>
  );
}

export default ChangeDp;
