import "./profile.css";
import ChangeDp from "./../../components/changeDp/changeDp";
import Post from "../../components/post/post";
import FriendItem from "./friend";
import React, { Suspense, lazy } from "react";
import CreatePost from "../../components/createPost/createPost";

import style from "./profile.module.css";
import Loader from "../../components/Loader/Loader";
import {
  FaUserCircle,
  FaBars,
  FaPlusCircle,
  FaEnvelope,
  FaCamera,
  FaArrowLeft,
  FaUserPlus,
  FaPen,
  FaUserMinus,
} from "react-icons/fa";
import useProfile from "./useProfile";
import useStories from "./useStories";
import useChangePhoto from "./useChangePhoto";
import Photos from "../../components/photos/Photos";
import FollowersList from "./followersList/FollowersList";
import useProfileMenu from "./useProfileMenu";

const ViewPost = lazy(() => import("../../components/post/viewPost"));

function Profile() {
  const {
    following,
    photos,
    followers,
    gender,
    age,
    fullname,
    follows,
    isOwn,
    profilePhoto,
    back,
    isFollowed,
    followUser
  } = useProfile();
  const { addFeed, feedStories, loading } = useStories();
  const {
    uploadEnable,
    upload,
    profile_photo_url,
    setUpload,
    setProfilePhotoUrl,
  } = useChangePhoto();
  const {
    viewFollowers,
    toggleOpenFollowers,
    createStory,
    createPost,
    seePhotos,
    openPhotos,
    viewPost,
    setViewPost,
  } = useProfileMenu();

  const PhtoItem = ({ image, id }) => {
    const my_api =
      process.env.NODE_ENV === "development" ? "http://localhost:4000" : "";
    return (
      <div
        id={id}
        className="photo-item-div"
        style={{ backgroundImage: "url(" + my_api + "/photo/" + image + ")" }}
      ></div>
    );
  };

  const Avatar = () => {
    return (
      <div className="dp-div">
        <img className="avatar" src={isOwn?profile_photo_url:profilePhoto}></img>
        {isOwn ? (
          <div className="camera-div" onClick={uploadEnable}>
            <FaCamera />
          </div>
        ) : (
          ""
        )}
      </div>
    );
  };
  const TempAvatar = () => {
    return (
      <div className="dp-div">
        <FaUserCircle className="temp-avatar" />
        {isOwn ? (
          <div className="camera-div" onClick={uploadEnable}>
            <FaCamera />
          </div>
        ) : (
          ""
        )}
      </div>
    );
  };
  if (createPost) return <CreatePost showMe={createStory} addStory={addFeed} />;
  else if (viewFollowers) return <FollowersList isOwn = {isOwn} back = {toggleOpenFollowers} numFollowers = {followers} fullname = {fullname}/>;
  else if (viewPost)
    return (
      <Suspense fallback={<div>Loading</div>}>
        <ViewPost id={viewPost} back={setViewPost} setRenderHeader={null} />
      </Suspense>
    );
  else if (openPhotos) return <Photos back={seePhotos} />;
  return (
    <React.Fragment>
      {upload ? (
        <ChangeDp
          setUpload={setUpload}
          setProfilePhotoUrl={setProfilePhotoUrl}
          profile_photo_url={profile_photo_url}
        />
      ) : (
        ""
      )}
      <div className={style.header}>
        <div className={style.back} onClick={back}>
          <FaArrowLeft className={style.headerIcon} />
        </div>
        <div className={style.title}>
          <h3>{isOwn?"Your Profile":fullname}</h3>
        </div>
        <div className={style.menu}>
          <FaBars className={style.headerIcon} />
        </div>
      </div>
      <div className="profile-header-div">
      <div className = "profile-background" style = {{backgroundImage:'url('+profilePhoto+')'}}></div>
        <div className="row1-profile-header">
          <div className="follower-div">
            <p className="follow-count">{followers?followers:0}</p>
            <p className="follow-count-title">Followers</p>
          </div>
          {isOwn?
          profile_photo_url !== undefined ? <Avatar /> : <TempAvatar />:
          profilePhoto !== null? <Avatar /> : <TempAvatar />
          }
          <div className="following-div">
            <p className="follow-count">{following?following:0}</p>
            <p className="follow-count-title">Following</p>
          </div>
        </div>
        <div className="information-div">
          <p className="fullname">{fullname}</p>
          <p className="gender">{gender}</p>
          <p className="age">{age}</p>
        </div>
        {!isOwn ? (
          <div className="profile-action">
            <button className={isFollowed?"button-unfollow":"button-follow"} onClick = {followUser}>
              {isFollowed?<><FaUserMinus className = "unfollow-icon"/>Unfollow</>:<><FaUserPlus className="follow-icon"/> Follow</>}
            </button>
            <button className="button-message">
              <FaEnvelope className="message-icon"></FaEnvelope> Message
            </button>
          </div>
        ) : (
          ""
        )}
      </div>
      {isOwn ? (
        <div className="editprofile-div">
          <button>
            {" "}
            <FaPen className="edit-icon"></FaPen> Edit Profile
          </button>
        </div>
      ) : (
        ""
      )}
      <div className="photos-div">
        <h4>Photos</h4>
        <div className="photo-list-div">
          {photos ? (
            photos.map((image, id) => (
              <PhtoItem image={image.path} key={id} id={id} />
            ))
          ) : (
            <Loader />
          )}
        </div>
        {photos && photos.length > 0 ? (
          <div className="generic-button-div">
            <button onClick={seePhotos}> See Photos</button>
          </div>
        ) : (
          ""
        )}
        {photos && photos.length === 0 ? (
          <center>
            <h4>No photos</h4>
          </center>
        ) : (
          ""
        )}
      </div>
      <div className="friends-div">
        <h4>Followers</h4>
        <div className="friends-list-div">
          {follows ? (
            follows.map((user, id) => (
              <FriendItem follower={user} key={id} id={id} />
            ))
          ) : (
            <Loader />
          )}
        </div>
        {follows && follows.length > 0 ? (
          <div className="generic-button-div">
            <button onClick={toggleOpenFollowers}> See Followers</button>
          </div>
        ) : (
          ""
        )}
        {follows && follows.length === 0 ? (
          <center>
            <h4>No followers</h4>
          </center>
        ) : (
          ""
        )}
      </div>
      <h2 className="section-title"> Stories</h2>
      {isOwn ? (
        <div className="primary-button">
          <button onClick={createStory}>
            {" "}
            <FaPlusCircle className="primary-button-icon"></FaPlusCircle>Share a
            story
          </button>
        </div>
      ) : (
        ""
      )}

      <div className="stories-div">
        <div className="post-div-list">
          {!feedStories ? (
            <div className="loader-div">
              <div className="loader"></div>
            </div>
          ) : (
            ""
          )}
          {loading ? (
            <div>
              <h3>Loading...</h3>
              <Loader />
            </div>
          ) : feedStories ? (
            feedStories.length === 0 ? (
              isOwn?
              <React.Fragment>
                <h2>You have no story</h2>
                <h3>Share something in your life</h3>
                </React.Fragment>
                :""
            ) : (
              feedStories.map((story, id) => (
                <Post content={story} key={id} id={id} openPost={setViewPost} />
              ))
            )
          ) : (
            ""
          )}
        </div>
      </div>
    </React.Fragment>
  );
}

export default Profile;
