import React, { useContext, useEffect, useState } from "react";
import { FaComment, FaThumbsUp } from "react-icons/fa";
import { GlobalCommentAction } from "../../logic/commentContext";
import useFeed from "../../logic/useFeed";
import Comment from "./Comment";
import style from "./view-comment.module.css";

const ViewComment = ({ story, postId }) => {
    const {addComment, getComments, requestLike, postLiked} = useFeed()

    const [content, setContent] = useState('')
    const [comments, setComments] = useState(null)
    const [likes, setLikes] = useState(story.likes)
    const [numComments, setNumComments] = useState(story.comments)
    const [liked, setLiked] = useState(null)

    useEffect(() => {
        const fetchComments = async()=>{
            const fechted_comments = await getComments(postId)
            setComments(fechted_comments)

            const is_liked = await postLiked(postId)
            setLiked(is_liked)
        }
        fetchComments()
    }, []);
  const inputContent = (e) => {
      setContent(e.target.value)
  }
  const postComment = async() => {
    const new_comment = await addComment(postId, content)
    setComments((olds) => [...olds, new_comment])
    setNumComments(numComments + 1)
  }
  const addLike = () => {
    if(liked !== null){
        requestLike(postId)
    if(liked){
        setLikes(likes-1)
        setLiked(false)
    }else{
        setLikes(likes+1)
        setLiked(true)
    }
    }
  }
  return (
    <div className={style.viewComment}>
      <div className={style.commentHeader}>
        <div className={style.commentHeading}>
          <div className={style.postStatus}>
            {likes}
            <FaThumbsUp className={liked?style.likedIcon:style.likeIcon} onClick = {addLike}/>
          </div>
          <h3>Comments</h3>
          <div className={style.postStatus}>
            {numComments}
            <FaComment className="like-icon" />
          </div>
        </div>
      </div>
      <hr></hr>
      <div className = {style.commentList}>
          {comments !== null? 
            comments.map((doc, id) => (
                <Comment document = {doc} key = {id}/>
            ))
          :''}
          <hr></hr>
          <div className = {style.commentWrite}>
              <textarea className = {style.commentInput}
              rows = "5"
              value = {content}
              onChange = {inputContent}
              />
              <button className = {style.submitComment} onClick = {postComment}>Post</button>
          </div>
      </div>
    </div>
  );
};

export default ViewComment;
