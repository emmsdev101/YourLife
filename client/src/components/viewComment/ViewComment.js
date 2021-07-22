import React, { useContext, useEffect, useState } from "react";
import { FaComment, FaThumbsUp } from "react-icons/fa";
import { GlobalCommentAction } from "../../logic/commentContext";
import useFeed from "../../logic/useFeed";
import Loader from "../Loader/Loader";
import Comment from "./Comment";
import style from "./view-comment.module.css";

const ViewComment = ({ story, postId }) => {
    const {addComment, getComments, requestLike, postLiked} = useFeed()

    const [content, setContent] = useState('')
    const [comments, setComments] = useState(null)
    const [likes, setLikes] = useState(story.likes)
    const [numComments, setNumComments] = useState(story.comments)
    const [liked, setLiked] = useState(null)
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [posting, setPosting] = useState(false)
    const [realTimeComments, setRealTimeComments] = useState([])

    useEffect(() => {
        const fetchComments = async()=>{
            const fechted_comments = await getComments(postId, 1, numComments)
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
    setPosting(true)
    const new_comment = await addComment(postId, content)
    if(new_comment){
        setRealTimeComments((olds) => [...olds, new_comment])
        setNumComments(numComments + 1)
        setContent('')
        setPosting(false)
    }
  }
  const loadMoreComments = async() => {
    setLoading(true)
    const nextPage = page + 1
    setPage(nextPage)
    const fechted_comments = await getComments(postId, nextPage, numComments)
    if(fechted_comments){
        setComments(comments => [...comments, ...fechted_comments])
        setLoading(false)
    }
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
      {comments !== null && comments.length + realTimeComments.length < numComments? 
           <div className = {style.loadMore}>
              {loading?<div className = {style.loader}></div>:<p onClick = {loadMoreComments}>Load more</p>}
          </div>:''}
          <div className = {style.reversedList}>
          {comments !== null? 
            comments.map((doc, id) => (
                <Comment document = {doc} key = {id}/>
            ))
          :<div>
            <h3>Loading comments...</h3>
            <Loader/>
            </div>}
          </div>
          {realTimeComments.map((doc, id) => (
                <Comment document = {doc} key = {id}/>
            ))
          }
          
          <hr></hr>
          <div className = {style.commentWrite}>
              <textarea className = {style.commentInput}
              rows = "5"
              value = {content}
              onChange = {inputContent}
              />
              <button className = {posting?style.posting:style.submitComment} onClick = {postComment}>Post</button>
          </div>
      </div>
    </div>
  );
};

export default ViewComment;
