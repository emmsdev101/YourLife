import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import UserContext from './logic/userContext';

const Main = () => {
    return (
    <div>
        <BrowserRouter>
            <UserContext>
                <App/>
            </UserContext>
        </BrowserRouter>
    </div>
    );
}

export default Main;
