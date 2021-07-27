import React, { useContext, useEffect, useRef, useState } from "react";
import { FaComment, FaThumbsUp } from "react-icons/fa";
import { GlobalCommentAction } from "../../logic/commentContext";
import useFeed from "../../logic/useFeed";
import Loader from "../Loader/Loader";
import Comment from "./Comment";
import style from "./view-comment.module.css";

const ViewComment = ({ story, postId }) => {
  const { addComment, getComments, requestLike, postLiked } = useFeed();

  const [content, setContent] = useState("");
  const [comments, setComments] = useState(null);
  const [likes, setLikes] = useState(story.likes);
  const [numComments, setNumComments] = useState(story.comments);
  const [liked, setLiked] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [posting, setPosting] = useState(false);
  const [realTimeComments, setRealTimeComments] = useState([]);

  let sumbitRef = useRef();
  let contentInput = useRef()

  useEffect(() => {
    const fetchComments = async () => {
      const fechted_comments = await getComments(postId, 1, numComments);
      setComments(fechted_comments);

      const is_liked = await postLiked(postId);
      setLiked(is_liked);
    };
    fetchComments();
    sumbitRef.current.disabled = true;
  }, []);
  useEffect(() => {
    if (content.length === 0) {
      sumbitRef.current.disabled = false;
      
    }
    const inputs = contentInput.current.value
    if(inputs.match(/\n/gm)){
      const input_rows =inputs.match(/\n/gm).length
      if(input_rows <= 10){
      contentInput.current.rows = input_rows
      }
    }
  }, [content]);
  const inputContent = (e) => {
    setContent(e.target.value);
  };
  const postComment = async () => {
    setPosting(true);
    const new_comment = await addComment(postId, content);
    if (new_comment) {
      setRealTimeComments((olds) => [...olds, new_comment]);
      setNumComments(numComments + 1);
      setContent("");
      setPosting(false);
    }
  };
  const loadMoreComments = async () => {
    setLoading(true);
    const nextPage = page + 1;
    setPage(nextPage);
    const fechted_comments = await getComments(postId, nextPage, numComments);
    if (fechted_comments) {
      setComments((comments) => [...comments, ...fechted_comments]);
      setLoading(false);
    }
  };
  const addLike = () => {
    if (liked !== null) {
      requestLike(postId);
      if (liked) {
        setLikes(likes - 1);
        setLiked(false);
      } else {
        setLikes(likes + 1);
        setLiked(true);
      }
    }
  };
  return (
    <div className={style.viewComment}>
      <div className={style.commentHeading}>
        <div className={style.postStatus}>
          <p className={liked ? style.liked : style.notLike}>{likes}</p>
          <FaThumbsUp
            className={liked ? style.likedIcon : style.likeIcon}
            onClick={addLike}
          />
        </div>
        <h3>Comments</h3>
        <div className={style.postStatus}>
          {numComments}
          <FaComment className="like-icon" />
        </div>
      </div>
      <div className={style.commentList}>
        {comments !== null &&
        comments.length + realTimeComments.length < numComments ? (
          <div className={style.loadMore}>
            {loading ? (
              <div className={style.loader}></div>
            ) : (
              <p onClick={loadMoreComments}>Load more</p>
            )}
          </div>
        ) : (
          ""
        )}
        <div className={style.reversedList}>
          {comments !== null ? (
            comments.length > 0 ? (
              comments.map((doc, id) => <Comment document={doc} key={id} />)
            ) : (
              <div className={style.noComment}>
                <h3>No comments on this post</h3>
                <p>Be the first to comment</p>
              </div>
            )
          ) : (
            <div className={style.loadingComments}>
              <h3>Loading comments...</h3>
              <Loader />
            </div>
          )}
        </div>
        {realTimeComments.map((doc, id) => (
          <Comment document={doc} key={id} />
        ))}
        <div className={style.commentWrite}>
          <textarea
            className={style.commentInput}
            value={content}
            onChange={inputContent}
            rows = "1"
            ref = {contentInput}
          />
          <button
            ref={sumbitRef}
            className={
              posting || content.length === 0
                ? style.posting
                : style.submitComment
            }
            onClick={postComment}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewComment;
