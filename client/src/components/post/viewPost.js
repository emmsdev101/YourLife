import React, { lazy, Suspense, useContext } from "react";
import "./viewPost.css";
import { useCustomHooks, useIcons, useReactHooks } from "../../logic/library";
import usePeople from "../../logic/usePeople";
import PostImage from "../postImage/postImage";
import { FaArrowLeft } from "react-icons/fa";
import ViewComment from "../viewComment/ViewComment";
import PhotoItem from "../photos/PhotoItem";
import ViewPhoto from "../photos/ViewPhoto";

const my_api =
  process.env.NODE_ENV === "development" ? "http://localhost:4000" : "";

const ViewPost = ({ id, back, setRenderHeader }) => {
  const { FaUserCircle } = useIcons();
  const { useEffect, useState, useHistory } = useReactHooks();
  const { useFeed } = useCustomHooks();
  const { getAStory } = useFeed();

  const [story, setStory] = useState(null);
  const [photos, setPhotos] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [view, setView] = useState(null);

  const [daysLapsed, setdaysLapsed] = useState(0);
  const [hoursLapsed, setHoursLapsed] = useState(0);
  const [minutesLapsed, setMinutesLapsed] = useState(0);

  const history = useHistory();

  useEffect(() => {
    if (setRenderHeader) setRenderHeader(false);
    const fetchPost = async () => {
      const fetchedStory = await getAStory(id);
      if (fetchedStory) {
        setStory(fetchedStory);
        preloadProfilePhoto(fetchedStory.photo);

        const postDate = new Date(fetchedStory.date);
        const dateNow = new Date();

        const dateDiff = dateNow.getTime() - postDate.getTime();
        setdaysLapsed(Math.trunc(dateDiff / (1000 * 3600 * 24)));
        setHoursLapsed(Math.trunc(dateDiff / (1000 * 3600)));
        setMinutesLapsed(Math.trunc(dateDiff / (1000 * 60)));
      }
      setPhotos(fetchedStory.images);
    };
    fetchPost();
    return () => {};
  }, []);
  function preloadProfilePhoto(subUrl) {
    const photoUrl = my_api + "/photo/" + subUrl;
    let image = new Image();
    image.onload = () => {
      setProfilePhoto(photoUrl);
    };
    image.src = photoUrl;
  }
  const close = () => {
    back(null);
  };
  const openPhoto = (val) => {
    console.log(photos[val]);
    setView(val);
  };
  const closePhoto = (val) => {
    setView(val);
  };
  if (view !== null)
    return <ViewPhoto photos={photos} index={view} back={closePhoto} />;
  return (
    <div className="view-post">
      <header className="post-header">
        <div className="back" onClick={close}>
          <FaArrowLeft />
        </div>
        <h3 className="post-title">
          {story !== null ? story.firstname : "Loading..."}
        </h3>
      </header>
      <div className="view-post-heading">
        {profilePhoto !== null ? (
          <img className="profile-photo" src={profilePhoto} alt="" />
        ) : (
          <FaUserCircle className="alt-dp" />
        )}
        <div className="view-post-heading-details">
          <h4>
            {story !== null
              ? story.firstname + " " + story.lastname
              : "loading..."}
          </h4>
          <p>
            {daysLapsed > 0
              ? daysLapsed > 1
                ? daysLapsed + " days ago"
                : "Day ago"
              : hoursLapsed > 0
              ? hoursLapsed > 1
                ? hoursLapsed + " hours ago"
                : hoursLapsed + " hour ago"
              : minutesLapsed > 0
              ? minutesLapsed > 1
                ? minutesLapsed + "minutes ago"
                : minutesLapsed + " minute ago"
              : "just now"}
          </p>
        </div>
      </div>
      <div className="post-body">
        <div className="content-text">
          <p className="content">{story !== null ? story.content : ""}</p>
          <div className="images-section">
            {photos !== null
              ? photos.map((photo, idx) => (
                  <PostImage
                    photosQuant={photos.length}
                    photo={photo}
                    key={id}
                    id={id}
                    src={my_api + "/photo/" + photo.path}
                    view={true}
                    openPhoto={openPhoto}
                    index={idx}
                  />
                ))
              : null}
          </div>
        </div>
      </div>
      {story !== null ? <ViewComment postId={id} story={story} /> : ""}
    </div>
  );
};

export default ViewPost;
