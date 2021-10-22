import React from "react";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import PostContext from "./logic/postContext";
import UserContext from "./logic/userContext";
import CommentContext from "./logic/commentContext";

import {socket, SocketContext} from './logic/socketHandler'

const Main = () => {
  return (
    <React.Fragment>
      <BrowserRouter>
      <SocketContext.Provider value = {socket}>
        <UserContext>
          <PostContext>
            <CommentContext>
              <App />
            </CommentContext>
          </PostContext>
        </UserContext>
        </SocketContext.Provider>
      </BrowserRouter>
    </React.Fragment>
  );
};

export default Main;
