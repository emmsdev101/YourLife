import React from "react";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import PostContext from "./logic/postContext";
import UserContext from "./logic/userContext";
import CommentContext from "./logic/commentContext";

const Main = () => {
  return (
    <React.Fragment>
      <BrowserRouter>
        <UserContext>
          <PostContext>
            <CommentContext>
              <App />
            </CommentContext>
          </PostContext>
        </UserContext>
      </BrowserRouter>
    </React.Fragment>
  );
};

export default Main;
