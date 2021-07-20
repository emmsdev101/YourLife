import React, { lazy, Suspense, useContext } from "react";
import "./viewPost.css";
import { useCustomHooks, useIcons, useReactHooks } from "../../logic/library";
import { useParams } from "react-router-dom";
import usePeople from "../../logic/usePeople";
import PostImage from "../postImage/postImage";
import { FaArrowLeft } from "react-icons/fa";
import { GlobalCommentAction, GlobalCommentContext } from "../../logic/commentContext";
import ViewComment from "../viewComment/ViewComment";

const my_api =
  process.env.NODE_ENV === "development" ? "http://localhost:4000" : "";

const ViewPost = ({ back }) => {

  const { FaUserCircle} = useIcons();
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
          <hr></hr>
        </div>
      </div>
      {story !== null? <ViewComment postId = {id} story = {story}/>:''}
    </div>
    
  );
};

export default ViewPost;
