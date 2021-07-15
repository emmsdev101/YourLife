import React, {Suspense, lazy, useState} from 'react';
import  { Route, BrowserRouter, Switch} from 'react-router-dom';
import  Cookies from 'universal-cookie'
import  UserContext from './logic/userContext';
import './App.css';
import './generalStyle/generalStyle.css'
import { useIcons, useReactHooks } from './logic/library';

const  Profile = lazy(()=>import('./pages/profile/profile'))
const  Home = lazy(()=>import('./pages/home/home'))
const  People = lazy(()=>import('./pages/People/people'))
const  Notification = lazy(()=>import('./pages/notification/notification'))
const  Chat = lazy(()=>import('./pages/chats/chat'))
const  Menu = lazy(()=>import("./pages/menu/menu"))
const  Signup = lazy(()=>import('./pages/sign-up/signup'))
const  Login = lazy(()=>import('./pages/login/login'))


function App() {
  const {FaHome, FaUsers, FaBell, FaEnvelope, FaBars} = useIcons()
  const {useHistory, useState} = useReactHooks()
  const history = useHistory()
  const cookie = new Cookies()
  const username = cookie.get('username')

  const [active, setActive] = useState('/home')

  function switchPage(page){
    setActive(page)
    history.push(page)
}
  const isLogged = ()=>{
    if(username === undefined){
      return true
    }
    return false
  }
  return (
    <Switch>
      <UserContext>
      {!isLogged()?
        <div className="App">
          <header className="home-header">
            <div className = {active === "/home"? "active":"inactive"} onClick = {()=>{switchPage('/home')}}> <FaHome className = "nav-icon"></FaHome></div>
            <div className = {active === "/people"? "active":"inactive"} onClick = {()=>{switchPage('/people')}}><FaUsers className = "nav-icon"></FaUsers></div> 
            <div className = {active === "/notification"? "active":"inactive"} onClick = {()=>{switchPage('/notification')}}><FaBell className = "nav-icon"></FaBell></div> 
            <div className = {active === "/chat"? "active":"inactive"} onClick = {()=>{switchPage('/chat')}}><FaEnvelope className = "nav-icon"></FaEnvelope></div> 
            <div className = {active === "/menu"? "active":"inactive"} onClick = {()=>{switchPage('/menu')}}><FaBars className = "nav-icon"></FaBars></div>
        </header>
        <Suspense fallback = {<div>Loading...</div>}>
          <Route exact path = "/menu"><Menu/></Route> 
          <Route exact path = "/people"><People/></Route>
          <Route exact path = "/notification"><Notification/></Route>
          <Route exact path = "/chat"><Chat/></Route>
          <Route exact path = "/home"><Home/></Route>
          <Route exact path = "/profile"><Profile/></Route>
          <Route exact path = "/login"><Home/></Route>
          <Route exact path = "/signup"><Home/></Route>
          <Route exact path = "/"><Home/></Route>
          </Suspense>
        </div>
      : 
      <>
          <Route exact path = "/"><Login/></Route>
          <Route exact path = "/signup"><Signup/></Route>
          <Route exact path = "/login"><Login/></Route>
      </>
      
    }
      </UserContext>
    </Switch>
  
  );
}

export default App;
