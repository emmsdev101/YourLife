import React, { Suspense, lazy } from "react";
import { Route, Switch } from "react-router-dom";
import style from "./app.module.css";
import Header from "./components/header/Header";
import useApp from "./useApp";

const Profile = lazy(() => import("./pages/profile/profile"));
const Home = lazy(() => import("./pages/home/home"));
const People = lazy(() => import("./pages/People/people"));
const Notification = lazy(() => import("./pages/notification/notification"));
const Chat = lazy(() => import("./pages/chats/chat"));
const Menu = lazy(() => import("./pages/menu/menu"));
const Signup = lazy(() => import("./pages/sign-up/signup"));
const Login = lazy(() => import("./pages/login/login"));

function App() {
  const {
    renderHeader,
    setRenderHeader,
    isLogged,
    stories,
    addFeed,
    fetchStory,
    loading,
    notifications,
    setNotifications,
    refreshNotifs,
    setStories,
    page,
    setPage,
    notifLoaded,
    chats,
    setChats,
    initChats,
    toggle
  } = useApp();

  return (
    <Switch>
      <React.Fragment>
        {isLogged() ? (
          <div className={style.App}>
            {renderHeader ? <Header toggleSound = {toggle} notifications={notifications} chats= {chats} /> : ""}
            <Suspense fallback={<div>Loading...</div>}>
              <Route exact path="/menu" component={Menu} />
              <Route
                exact
                path="/people"
                render={(props) => (
                  <People {...props} setRenderHeader={setRenderHeader} />
                )}
              />
              <Route
                exact
                path="/notification"
                render={(props) => (
                  <Notification
                    {...props}
                    setRenderHeader={setRenderHeader}
                    notifications={notifications}
                    setNotifications={setNotifications}
                    refreshNotifs={refreshNotifs}
                    notifLoaded={notifLoaded}
                  />
                )}
              />
              <Route
                exact
                path="/chat"
                render={(props) => (
                  <Chat
                    {...props}
                    chats={chats}
                    setChats={setChats}
                    initChats={initChats}
                  />
                )}
              />
              <Route exact path="/profile" component={Profile} />
              <Route
                exact
                path="/login"
                render={(props) => (
                  <Home
                    {...props}
                    feedStories={stories}
                    addFeed={addFeed}
                    fetchFeeds={fetchStory}
                    loading={loading}
                    setRenderHeader={setRenderHeader}
                    setFeeds={setStories}
                    page={page}
                    setPage={setPage}
                  />
                )}
              />
              <Route
                exact
                path="/signup"
                render={(props) => (
                  <Home
                    {...props}
                    feedStories={stories}
                    addFeed={addFeed}
                    fetchFeeds={fetchStory}
                    loading={loading}
                    setRenderHeader={setRenderHeader}
                    setFeeds={setStories}
                    page={page}
                    setPage={setPage}
                  />
                )}
              />
              <Route
                exact
                path="/home"
                render={(props) => (
                  <Home
                    {...props}
                    feedStories={stories}
                    addFeed={addFeed}
                    fetchFeeds={fetchStory}
                    loading={loading}
                    setRenderHeader={setRenderHeader}
                    setFeeds={setStories}
                    page={page}
                    setPage={setPage}
                  />
                )}
              />
              <Route
                exact
                path="/"
                render={(props) => (
                  <Home
                    {...props}
                    feedStories={stories}
                    addFeed={addFeed}
                    fetchFeeds={fetchStory}
                    loading={loading}
                    setRenderHeader={setRenderHeader}
                    setFeeds={setStories}
                    page={page}
                    setPage={setPage}
                  />
                )}
              />
              <Route exact path="/profile/:username" component={Profile} />
            </Suspense>
          </div>
        ) : (
          <Suspense fallback={<div>Loading...</div>}>
            <Route exact path="/menu" component={Login} />
            <Route exact path="/people" component={Login} />
            <Route exact path="/notification" component={Login} />
            <Route exact path="/chat" component={Login} />
            <Route exact path="/profile" component={Login} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/signup" component={Signup} />
            <Route exact path="/home" component={Login} />
            <Route exact path="/" component={Login} />
          </Suspense>
        )}
      </React.Fragment>
    </Switch>
  );
}

export default App;
