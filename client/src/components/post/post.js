import "./style.css";
import { useCustomHooks, useIcons, useReactHooks } from "../../logic/library";
import PostImage from "../postImage/postImage";
import React, { useContext } from "react";
import { GlobalPostAction } from "../../logic/postContext";
import { GlobalCommentAction } from "../../logic/commentContext";

function Post({ content, openPost }) {
  const { useState, useHistory, useEffect } = useReactHooks();
  const { useFeed, usePeople } = useCustomHooks();
  const { FaComment, FaEllipsisH, FaThumbsUp, FaUserCircle } = useIcons();
  const my_api = process.env.NODE_ENV === "development" ? "http://localhost:4000" : "";
  const { requestLike, postLiked, requestUnlike } = useFeed();

  const [render, setRender] = useState(false);
  const [isMounted, setIsMounted] = useState(true);
  const [likes, setLikes] = useState(content.likes)

  const comments = content.comments
  const [liked, setLiked] = useState(content.liked)

  const username = content.username
  const firstname = content.firstname
  const lastname = content.lastname
  const profile_photo_url = my_api + "/photo/" + content.photo
  const photos = content.photos


  const postDate = new Date(content.date)
  const dateNow = new Date()

  const dateDiff = dateNow.getTime() - postDate.getTime()
  const daysLapsed = Math.trunc(dateDiff / (1000 * 3600 * 24))
  const hoursLapsed = Math.trunc(dateDiff / (1000 * 3600))
  const minutesLapsed = Math.trunc(dateDiff / (1000 * 60))
  
  const history = useHistory();

  const setPostToComment = useContext(GlobalCommentAction);

  useEffect(() => {

    const getUserDetails = async () => {
      let pp = new Image();
      pp.onload = () => {
        if (isMounted) setRender(true);
      };
      pp.src = profile_photo_url
    };
    getUserDetails();
    setLiked(content.liked)
    return () => {
      setIsMounted(false);
    };
  }, [content]);

  const viewPost = () => {
    openPost(content._id)
  };

  const likePost = () => {
    if(content.liked){
      setLikes(likes-1)
      requestUnlike(content)
    }else{
      requestLike(content)
      setLikes(likes+1)
    }
    setLiked(!content.liked)
  }
  const openComment = () => {
    setPostToComment(content._id)
  }
  const viewProfile = () => {
    history.push("/profile/"+username)
  }
    return (
      <React.Fragment>
        <div className="post-div">
          <div className="post-heading">
            {render ? (
              <img
                className="profile-photo"
                src={profile_photo_url}
                alt=""
                onClick = {viewProfile}
              />
            ) : (
              <FaUserCircle className="alt-dp" onClick = {viewProfile}/>
            )}
            <div className="post-details">
              <p className = "postName" onClick = {viewProfile}>{firstname + " " + lastname}</p>
              <p className = "postTime">
                {daysLapsed>0?daysLapsed>1?daysLapsed+" days ago":"Day ago":
                hoursLapsed>0?hoursLapsed>1?hoursLapsed + " hours ago":hoursLapsed+" hour ago":
                minutesLapsed>0?minutesLapsed>1?minutesLapsed + "minutes ago":minutesLapsed+" minute ago":
                "just now"
                }

              </p>
            </div>
            <div className="post-menu">
              {" "}
              <FaEllipsisH className="post-menu-icon"></FaEllipsisH>{" "}
            </div>
          </div>
          <div className="post-body">
            <div className="content-text">
              <p className="content">{content.content}</p>
              <div className="images-section" onClick={viewPost}>
                {Array.isArray(photos)?
                   photos.map((photo, id) => (
                      <PostImage
                        photosQuant={photos.length}
                        photo={photo}
                        key={id}
                        id={id}
                        src={my_api + "/photo/" + photo.path}
                        view = {false}
                      />
                    ))
                  : null}
                {Array.isArray(photos) && photos.length > 4 ? (
                  <button className="more-btn">{photos.length - 4} more</button>
                ) : (
                  ""
                )}
              </div>
              {likes > 0 || comments > 0 ?
              <div className="content-footer">
                <div className="comment-status">
                <React.Fragment>
                  <p className="comment-count">{likes}</p>
                <p className="status-title">{likes > 1? "Likes":"Like"}</p>
                </React.Fragment>
              </div>
                <div className="comment-status">
                <React.Fragment>
                <p className="comment-count">{comments}</p>
                <p className="status-title">{comments > 1? "Comments":"Comment"}</p>
                </React.Fragment>
                </div>
              </div>
              :''}
            </div>
          </div>
          <div className="post-footer">
            <button className={liked? "liked-button":"like-button"} onClick = {likePost}>
              <FaThumbsUp className= "liked-icon" ></FaThumbsUp>{liked?"Liked":"Like"}
            </button>
            <button className="like-button" onClick = {viewPost}>
              <FaComment className="like-icon"></FaComment>Comment
            </button>
          </div>
        </div>

      </React.Fragment>
    );
}
export default Post;
