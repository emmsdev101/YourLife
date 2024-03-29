import style from "./home.module.css";
import Post from "../../components/post/post";
import CreatePost from "../../components/createPost/createPost";
import React, { Suspense,lazy, useEffect } from "react";
import useHome from "./useHome";
import { FaArrowDown, FaArrowUp, FaPlusCircle } from "react-icons/fa";
import Loader from "../../components/Loader/Loader";

const ViewPost = lazy(() => import ("./../../components/post/viewPost"));

function Home({ feedStories, addFeed, fetchFeeds, loading, setRenderHeader, setFeeds, page, setPage }) {
  const { createPost, createStory, viewPost, view, isLoading, loadMore, isMiddle} = useHome(setRenderHeader, setFeeds, page, setPage);

  if(view){
   return (
       <Suspense fallback = {<div className = {style.postLoading}><Loader/></div>}>
            <ViewPost id = {view} back = {viewPost} setRenderHeader = {setRenderHeader}/>
       </Suspense>
   )
  }else{
    return (
        <React.Fragment>
          {createPost ? (
            <CreatePost showMe={createStory} addStory={addFeed} />
          ) : (
            <div className={style.homeBody}>
              <div className={style.homeTitle}>
                <div className={style.primaryButton}>
                  <button onClick={createStory} className={style.button}>
                    {" "}
                    <FaPlusCircle
                      className={style.primaryButtonIcon}
                    ></FaPlusCircle>
                    Share a story
                  </button>
                </div>
                <div className = {style.refreshFeeds} onClick = {fetchFeeds}>
                    Refresh
                    <FaArrowDown className = {style.refreshIcon}/>
                </div>
              </div>
              {loading ? (
                <Loader />
              ) : (
                <div className={style.postList} id = 'postList'>
                  {feedStories && feedStories.length === 0 ? (
                    <>
                      <h3>No stories yet </h3>
                      <h3>Follow poeple to see their stories</h3>
                    </>
                  ) : (
                    ""
                  )}
                  {feedStories
                    ? feedStories.map((story, id) => (
                        <Post content={story} key={id} openPost = {viewPost}/>
                      ))
                    : ""}
                </div>
              )}
              {feedStories?.length > 10? isLoading?<div className = {style.loadingDiv}><Loader/></div>:<button className = {style.loadMore} onClick = {loadMore}>Load more</button>:''}
              {isMiddle?<a className = {style.scrollUp} href = "#postList">
                <FaArrowUp/>
                </a>:''}
            </div>
          )}
        </React.Fragment>
      );
  }
}
export default Home;
