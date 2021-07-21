import "./style.css";
import { useCustomHooks, useIcons, useReactHooks } from "../../logic/library";
import PostImage from "../postImage/postImage";
import React, { useContext } from "react";
import { GlobalPostAction } from "../../logic/postContext";
import { GlobalCommentAction } from "../../logic/commentContext";

function Post({ content }) {
  const { useState, useHistory, useEffect } = useReactHooks();
  const { useFeed, usePeople } = useCustomHooks();
  const { FaComment, FaEllipsisH, FaThumbsUp, FaUserCircle } = useIcons();
  const my_api = process.env.NODE_ENV === "development" ? "http://localhost:4000" : "";
  const { requestLike, postLiked } = useFeed();

  const [render, setRender] = useState(false);
  const [isMounted, setIsMounted] = useState(true);
  const [likes, setLikes] = useState(content.likes)

  const comments = content.comments
  const [liked, setLiked] = useState(content.liked)

  const username = content.username
  const firstname = content.firstname
  const lastname = content.lastname
  const profile_photo_url = my_api + "/photos/" + content.photo
  const photos = content.photos

  

  const history = useHistory();

  const setPostToComment = useContext(GlobalCommentAction);

  useEffect(() => {

    const checkLiked = async() => {
      const is_liked = await postLiked(content._id)
      setLiked(is_liked)
    }

    const getUserDetails = async () => {
      let pp = new Image();
      pp.onload = () => {
        if (isMounted) setRender(true);
      };
      pp.src = profile_photo_url
    };
    checkLiked()
    getUserDetails();

    return () => {
      setIsMounted(false);
    };
  }, [content]);

  const viewPost = () => {
    history.push("/viewpost/" + content._id);
  };

  const likePost = () => {
    setLiked(!liked)
    requestLike(content._id)
    if(liked){
      setLikes(likes-1)
    }else{
      setLikes(likes+1)
    }
  }
  const openComment = () => {
    setPostToComment(content._id)
  }
    return (
      <React.Fragment>
        <div className="post-div">
          <div className="post-heading">
            {render ? (
              <img
                className="profile-photo"
                src={profile_photo_url}
                alt="profile picture"
              />
            ) : (
              <FaUserCircle className="alt-dp" />
            )}
            <div className="post-details">
              <h4>{firstname + " " + lastname}</h4>
              <p>13 minutes ago</p>
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
                        src={my_api + "/photos/" + photo.path}
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
              <div className="content-footer">
                <div className="comment-status">
                  <p className="comment-count">{likes}</p>
                  <p className="status-title">Likes</p>
                </div>
                <div className="comment-status">
                  <p className="comment-count">{comments}</p>
                  <p className="status-title">Comments</p>
                </div>
              </div>
              <hr></hr>
            </div>
          </div>
          <div className="post-footer">
            <button className="like-button" onClick = {likePost}>
              <FaThumbsUp className={liked? "liked-icon":"like-icon"} ></FaThumbsUp>{liked?"Liked":"Like"}
            </button>
            <button className="like-button" onClick = {viewPost}>
              <FaComment className="like-icon"></FaComment>Comment
            </button>
          </div>
        </div>
        <div className="span"></div>
      </React.Fragment>
    );
}
export default Post;
