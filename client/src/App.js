import React, {Suspense, lazy, useState, useRef} from 'react';
import  { Route, BrowserRouter, Switch, useLocation} from 'react-router-dom';
import  Cookies from 'universal-cookie'

import './App.css';
import ViewPost from './components/post/viewPost';
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
  const currentLocation = useLocation()
  const [render, setRender] = useState(false)
  
  const [active, setActive] = useState('')

  useEffect(() => {
    console.log(user_context.username)
    set_user_context(username).then((res)=>{
      setRender(true)
    },()=> {
      setRender(true)
    })
    setActive(currentLocation.pathname)    
  }, []);
  const isLogged = () => {
  if( user_context.username !== undefined){return true}
    else return false;
  }
  function switchPage(page){
    setActive(page)
    history.push(page)
  }
  const Header = () => {
    return (
      <header className="home-header">
          <div className = {active === "/home" || active === "/"? "active":"inactive"} onClick = {()=>{switchPage('/home')}}> <FaHome className = "nav-icon"></FaHome></div>
          <div className = {active === "/people"? "active":"inactive"} onClick = {()=>{switchPage('/people')}}><FaUsers className = "nav-icon"></FaUsers></div> 
          <div className = {active === "/notification"? "active":"inactive"} onClick = {()=>{switchPage('/notification')}}><FaBell className = "nav-icon"></FaBell></div> 
          <div className = {active === "/chat"? "active":"inactive"} onClick = {()=>{switchPage('/chat')}}><FaEnvelope className = "nav-icon"></FaEnvelope></div> 
          <div className = {active === "/menu"? "active":"inactive"} onClick = {()=>{switchPage('/menu')}}><FaBars className = "nav-icon"></FaBars></div>
      </header>
    )
  }
  if(render){
    return (
      <Switch>
        {isLogged() === true?
          <div className="App">
          <Header/>
          <Suspense fallback = {<div>Loading...</div>}>
            <Route exact path = "/menu" component = {Menu}/>
            <Route exact path = "/people" component = {People}/>
            <Route exact path = "/notification" component = {Notification}/>
            <Route exact path = "/chat" component = {Chat}/>
            <Route exact path = "/profile" component = {Profile}/>
            <Route exact path = "/login" component = {Home}/>
            <Route exact path = "/signup" component = {Home}/>
            <Route exact path = "/home" component = {Home}/>
            <Route exact path = "/" component = {Home}/>

            </Suspense>
            <Suspense fallback = {<div>Please Wait...</div>} >
              <Route exact path = "/viewpost/:id" component = {ViewPost}/>
            </Suspense>
          </div>
        : 
        <Suspense fallback = {<div>Loading...</div>}>
            <Route exact path = "/signup" component ={Signup}/>
            <Route exact path = "/login" component = {Login}/>
            <Route exact path = "/" component = {Login}/>
            </Suspense>
      }
      </Switch>
    
    );
  }else return(<></>)
}

export default App;
