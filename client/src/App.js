
import './App.css';
import Profile from './pages/profile/profile';
import Home from './pages/home/home'
import People from './pages/People/people'
import Notification from './pages/notification/notification'
import Chat from './pages/chats/chat'
import Menu from "./pages/menu/menu";
import Signup from './pages/sign-up/signup'
import Login from './pages/login/login'
import { Route, BrowserRouter, Switch} from 'react-router-dom';
import Cookies from 'universal-cookie'
import UserContext from './logic/userContext';

function App() {
  const cookie = new Cookies()
  const username = cookie.get('username')

  const isLogged = ()=>{
    if(username === undefined){
      return true
    }
    return false
  }
  return (
    <BrowserRouter>
    <Switch>
      <UserContext>
      {!isLogged()?
        <div className="App"> 
          <Route exact path = "/menu"><Menu/></Route> 
          <Route exact path = "/people"><People/></Route>
          <Route exact path = "/notification"><Notification/></Route>
          <Route exact path = "/chat"><Chat/></Route>
          <Route exact path = "/home"><Home/></Route>
          <Route exact path = "/profile"><Profile/></Route>
          <Route exact path = "/login"><Home/></Route>
          <Route exact path = "/signup"><Home/></Route>
          <Route exact path = "/"><Home/></Route>
        </div>
      : <>
          <Route exact path = "/"><Login/></Route>
          <Route exact path = "/signup"><Signup/></Route>
          <Route exact path = "/login"><Login/></Route>
      </>
    }

      </UserContext>
    
    </Switch>
    </BrowserRouter>
  );
}

export default App;
