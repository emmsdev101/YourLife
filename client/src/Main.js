import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import PostContext from './logic/postContext';
import UserContext from './logic/userContext';

const Main = () => {
    return (
    <div>
        <BrowserRouter>
            <UserContext>
                <PostContext>
                    <App/>
                </PostContext>
            </UserContext>
        </BrowserRouter>
    </div>
    );
}

export default Main;
