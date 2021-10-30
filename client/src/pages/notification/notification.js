import style from './notification.module.css'
import NotificationItem from "../../components/notification/notification";
import { useIcons, useReactHooks } from "../../logic/library";
import useNotification from "./useNotification";
import { Suspense, lazy } from "react";

const ViewPost = lazy(() => import("../../components/post/viewPost"));
function Notification({ setRenderHeader, notifications, setNotifications, refreshNotifs,notifLoaded }) {
  const { FaSearch } = useIcons();
  const { useHistory } = useReactHooks();
  const { viewNotification, setViewNotification, closePost, readNotification,loadingNext, loadMore } =
    useNotification(setRenderHeader, notifications, setNotifications);

  const history = useHistory();
  function switchPage(page) {
    history.push(page);
  }
  if (viewNotification) {
    return (
      <Suspense fallback={<div>Loading</div>}>
        <ViewPost
          id={viewNotification}
          back={closePost}
          setRenderHeader={null}
        />
      </Suspense>
    );
  } else
    return (
      <div className={style.peopleBody}>
        <div className={style.peopleHeader}>
          <h3>Notification</h3>
          <button className = {style.notifRefresh} onClick = {refreshNotifs}>Refresh</button>
          <button className={style.searchButton}>
            <FaSearch className={style.searchIcon}></FaSearch>
          </button>
        </div>
        <div className={style.peopleListDiv}>
          <br />
          {!notifications || !notifLoaded
            ? "loading notifications..."
            : notifications.length < 1
            ? "You have no notifications"
            : ""}
          {notifications?.map((item, id) => (
            <NotificationItem
              notification={item}
              setRenderHeader={setRenderHeader}
              setViewNotification={setViewNotification}
              openProfile={switchPage}
              key={id}
              id={id}
              readNotif={readNotification}
            ></NotificationItem>
          ))}
          {notifications?.length > 9  && !loadingNext? (
            <div className={style.loadMore} onClick ={loadMore}>Load more</div>
          ) : (
            ""
          )}
          {loadingNext ? "loading notifications..." : ""}
        </div>
      </div>
    );
}
export default Notification;
