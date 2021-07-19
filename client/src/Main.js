import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import PostContext from './logic/postContext';
import UserContext from './logic/userContext';

const Main = () => {
    return (
        <React.Fragment>
        <BrowserRouter>
            <UserContext>
                <PostContext>
                    <App/>
                </PostContext>
            </UserContext>
        </BrowserRouter>
        </React.Fragment>
    );
}

export default Main;
