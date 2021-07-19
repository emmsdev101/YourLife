import React from "react";
import "./viewPost.css";
import { useCustomHooks, useIcons, useReactHooks } from "../../logic/library";
import { useParams } from "react-router-dom";
import usePeople from "../../logic/usePeople";
import PostImage from "../postImage/postImage";
import { FaArrowLeft } from "react-icons/fa";

const my_api =
  process.env.NODE_ENV === "development" ? "http://localhost:4000" : "";

const ViewPost = ({ postData, back }) => {
  const { FaUserCircle, FaThumbsUp, FaComment } = useIcons();
  const { useEffect, useState,useHistory } = useReactHooks();
  const { useFeed } = useCustomHooks();
  const { fetchImages, getAStory } = useFeed();
  const { getUserInfo } = usePeople();

  const [story, setStory] = useState(null);
  const [photos, setPhotos] = useState(null);
  const [profileDetails, setProfileDetails] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);

  const history = useHistory()

  const { id } = useParams();
  useEffect(() => {
    back(false)
    const fetchPost = async () => {
      const fetchedStory = await getAStory(id);
      if (fetchedStory) {
        setStory(fetchedStory);
        const fetchedProfile = await getUserInfo(fetchedStory.owner);
        if (fetchedProfile) {
          setProfileDetails(fetchedProfile);
          preloadProfilePhoto(fetchedProfile.photo);
        }
      }
      const fetchedImages = await fetchImages(id);
      if (fetchedImages) {
        setPhotos(fetchedImages);
      }
    };
    fetchPost();
    return () => {
      back(true)
    }
  }, []);
  function preloadProfilePhoto(subUrl) {
    const photoUrl = my_api + "/photos/" + subUrl;
    let image = new Image();
    image.onload = () => {
      setProfilePhoto(photoUrl);
    };
    image.src = photoUrl;
  }
  const close = () => {
    history.goBack()
  }
  return (
    <div className="view-post">
      <header className="post-header">
        <div className = "back" onClick = {close}>
          <FaArrowLeft/>
        </div>
        <h3 className = "post-title">{profileDetails !== null? profileDetails.firstname:''}</h3>
      </header>
      <div className="view-post-heading">
        {profilePhoto !== null ? (
          <img
            className="profile-photo"
            src={profilePhoto}
            alt="profile picture"
          />
        ) : (
          <FaUserCircle className="alt-dp" />
        )}
        <div className="view-post-heading-details">
          <h4>
            {profileDetails !== null
              ? profileDetails.firstname + " " + profileDetails.lastname
              : ""}
          </h4>
          <p>13 minutes ago</p>
        </div>
      </div>
      <div className="post-body">
        <div className="content-text">
          <p className="content">{story !== null ? story.content : ""}</p>
          <div className="images-section">
            {photos !== null
              ? photos.map((photo, id) => (
                  <PostImage
                    photosQuant={photos.length}
                    photo={photo}
                    key={id}
                    id={id}
                    src={my_api + "/photos/" + photo.path}
                    view = {true}
                  />
                ))
              : null}
          </div>
          <div className="content-footer">
            <div className="comment-status">
              <p className="comment-count">333</p>
              <p className="status-title">Likes</p>
            </div>
            <div className="comment-status">
              <p className="comment-count">221</p>
              <p className="status-title">Comments</p>
            </div>
          </div>
          <hr></hr>
        </div>
      </div>
      <div className="post-footer">
        <button className="like-button">
          <FaThumbsUp className="like-icon"></FaThumbsUp>Like
        </button>
        <button className="like-button">
          <FaComment className="like-icon"></FaComment>Comment
        </button>
      </div>
    </div>
  );
};

export default ViewPost;
