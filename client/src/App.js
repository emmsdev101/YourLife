import React, {Suspense, lazy, useState, useRef} from 'react';
import  { Route, BrowserRouter, Switch} from 'react-router-dom';
import  Cookies from 'universal-cookie'

import './App.css';
import './generalStyle/generalStyle.css'
import { useCustomHooks, useIcons, useReactHooks } from './logic/library';

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
  const {useHistory, useState, useContext, useEffect} = useReactHooks()
  const {GlobalUserContext, GlobalUserActionsContext} = useCustomHooks()
  const set_user_context = useContext(GlobalUserActionsContext);
  const user_context = useContext(GlobalUserContext)
  const history = useHistory()
  const cookie = new Cookies()
  const username = cookie.get('username')
  const [render, setRender] = useState(false)
  
  const [active, setActive] = useState('/home')

  useEffect(() => {
    set_user_context(username).then((res)=>{
      setRender(true)
    },()=> {
      setRender(true)
    })
  }, []);
  const isLogged = () => {
  if( user_context.username !== undefined){return true}
    else return false;
  }
  function switchPage(page){
    setActive(page)
    history.push(page)
  }
  if(render){
    return (
      <Switch>
        <React.Fragment>
        {isLogged() === true?
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
        <Suspense fallback = {<div>Loading...</div>}>
            <Route exact path = "/signup"><Signup/></Route>
            <Route exact path = "/login"><Login/></Route>
            <Route path = "/"><Login/></Route>
            </Suspense>
      }
      </React.Fragment>
      </Switch>
    
    );
  }else return(<></>)
}

export default App;
