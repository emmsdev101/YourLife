import { FaArrowLeft, FaCamera, FaImages, FaVideo } from "react-icons/fa";
import UploadingProgress from "../uploadingProgress/UploadingProgress";
import style from "./createpost.module.css";
import useCreatePost from "./useCreatePost";
function CreatePost({ showMe, addStory }) {
  const {
    uploadingProgress,
    posting,
    handleInput,
    handleSubmit,
    content,
    imgFiles,
    pickImage,
    openPicker,
  } = useCreatePost(showMe, addStory);

  return (
    <>
      <div className={style.createPost}>
        {posting ? <UploadingProgress uploadingProgress= {uploadingProgress} /> : ""}
        <div className={style.createPostHeader}>
          <button className={style.backBtn} onClick={showMe}>
            {" "}
            <FaArrowLeft className={style.backIcon} />
          </button>
          <h4 className={style.headerTitle}>Create a story</h4>
          <button className={style.postBtn} onClick={handleSubmit}>
            Post
          </button>
        </div>
        <hr />
        <div className={style.createPostBody}>
          <div className={style.postContentDiv}>
            <textarea
              id="post-input"
              className={style.postInput}
              rows="10"
              placeholder="Whats new?"
              value={content}
              onChange={handleInput}
            ></textarea>
            <div className={style.photoList}>
              {imgFiles.length > 0
                ? imgFiles.map((url, id) => (
                    <img
                      alt="pictures"
                      key={id}
                      src={url}
                      className={style.photo}
                    />
                  ))
                : ""}
            </div>
            <input
              type="file"
              accept="image/*"
              hidden
              id="image-picker"
              onChange={pickImage}
              multiple
            />
          </div>
          <div className={style.addPhotos} onClick={openPicker}>
            <FaImages className={style.utilityIcons} />
            <p>Photo</p>
          </div>
          <div className={style.addPhotos}>
            <FaCamera className={style.utilityIcons} />
            <p>Capture</p>
          </div>
          <div className={style.addPhotos}>
            <FaVideo className={style.utilityIcons} />
            <p>Vedio</p>
          </div>
          <div className={style.addPhotos}></div>
        </div>
      </div>
    </>
  );
}
export default CreatePost;
