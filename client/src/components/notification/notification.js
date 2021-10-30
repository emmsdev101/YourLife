import style from './notification.module.css'
import { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import axios from "axios";
import {MY_API} from './../../config'

function NotificationItem({
  notification,
  setRenderHeader,
  setViewNotification,
  openProfile,
  id,
  readNotif
}) {
  const [dpLoaded, setDpLoaded] = useState(false);

  const [seen, setSeen] = useState(null);
  const postId = notification.post_id || notification.story?._id;

  const postDate = new Date(notification.date);
  const dateNow = new Date();

  const dateDiff = dateNow.getTime() - postDate.getTime();
  const daysLapsed = Math.trunc(dateDiff / (1000 * 3600 * 24));
  const hoursLapsed = Math.trunc(dateDiff / (1000 * 3600));
  const minutesLapsed = Math.trunc(dateDiff / (1000 * 60));

  useEffect(() => {
    setSeen(notification.seen);
  }, []);

  function preloadProfilePicture(url) {
    let preload = new Image();
    preload.onload = () => {
      setDpLoaded(true);
    };
    preload.src = url;
  }
  function openNotification() {
    if (notification.type === "comment" || notification.type === "like") {
      setRenderHeader(false);
      setViewNotification(postId);
    } else {
      openProfile("/profile/" + notification.follower.username);
    }
  }
  const readNotification = async () => {
    if (!seen) {
      readNotif(id)
      if (notification.type === "comment") {
        axios({
          method: "post",
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
          url: MY_API + "/notification/read-comment",
          data: {
            comment_id: notification.comment_id,
            notification_id: notification.notification_id,
          },
        });
      } else {
        console.log("like",notification.notification_id)
        axios({
          method: "post",
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
          url: MY_API + "/notification/read",
          data: { notification_id: notification.notification_id },
        });
      }
    }
    setSeen(true);
    openNotification();
  };
  if (notification.type === "comment") {
    const profilePhoto =
      MY_API + "/photo/" + notification.comments.last_commentor[0].photo;

    preloadProfilePicture(profilePhoto);

    const comments = notification.comments.last_commentor;
    const numCommentors = notification.comments.count - 2;
    const who = notification.comments.owner ? "your" : "a";

    function getCommentorsNames() {
      let names = comments[0].firstname + " " + comments[0].lastname;
      const other = numCommentors > 1 ? " others " : " other ";
      names +=
        numCommentors > 0 ? " and " + numCommentors + other + "also" : "";
      return names;
    }
    return (
      <div
        className={!seen ? style.unreadNotificationDiv : style.notificationDiv}
        onClick={readNotification}
      >
        {dpLoaded ? (
          <img className={style.notificationPicture} src={profilePhoto} alt=""></img>
        ) : (
          <FaUserCircle className={style.notificationPicture} />
        )}
        <div className={style.notificationDetail}>
          <p className={style.notificationName}>{getCommentorsNames()}</p>
          <p className={style.notificationContent}>
            {`Commented on  ${who} story:"${notification.comments.last_comment}"`}
          </p>
          <p className={style.notificationStatus}>
            {daysLapsed > 0
              ? daysLapsed > 1
                ? daysLapsed + " days ago"
                : "Day ago"
              : hoursLapsed > 0
              ? hoursLapsed > 1
                ? hoursLapsed + " hours ago"
                : hoursLapsed + " hour ago"
              : minutesLapsed > 0
              ? minutesLapsed > 1
                ? minutesLapsed + "minutes ago"
                : minutesLapsed + " minute ago"
              : "just now"}
          </p>
        </div>
      </div>
    );
  } else if (notification.type === "like" && notification.story) {
    const likers = notification.likers;
    const numLikers = notification.num_likers;
    const profilePhoto = MY_API + "/photo/" + likers[0]?.photo;

    preloadProfilePicture(profilePhoto);

    function getLikersNames() {
      let names = "";
      for (let i = 0; i < likers.length; i++) {
        const and =
          i < likers.length - 1 ? (i < numLikers - 2 ? ", " : " and ") : "";
        names += likers[i].firstname + " " + likers[i].lastname + and;
      }
      const other = numLikers - 3 > 1 ? " others " : " other ";
      names +=
        numLikers > 3
          ? " and " + (numLikers - 3) + other + "liked your story "
          : "liked your story";
      return names;
    }

    return (
      <div
        className={!seen ? style.unreadNotificationDiv : style.notificationDiv}
        onClick={readNotification}
      >
        {dpLoaded ? (
          <img className={style.notificationPicture} src={profilePhoto} alt=""></img>
        ) : (
          <FaUserCircle className={style.notificationPicture} />
        )}
        <div className={style.notificationDetail}>
          <p className={style.notificationName}>{getLikersNames()}</p>
          <p className={style.notificationContent}>
            {" "}
            "{notification.story.content.slice(0, 60)}"
          </p>

          <p className={style.notificationStatus}>
            {daysLapsed > 0
              ? daysLapsed > 1
                ? daysLapsed + " days ago"
                : "Day ago"
              : hoursLapsed > 0
              ? hoursLapsed > 1
                ? hoursLapsed + " hours ago"
                : hoursLapsed + " hour ago"
              : minutesLapsed > 0
              ? minutesLapsed > 1
                ? minutesLapsed + "minutes ago"
                : minutesLapsed + " minute ago"
              : "just now"}
          </p>
        </div>
      </div>
    );
  } else if (notification.type === "follow") {
    const fullname = `${notification.follower.firstname} ${notification.follower.lastname}`;
    const profilePhoto = MY_API + "/photo/" + notification.follower.photo;

    preloadProfilePicture(profilePhoto);
    return (
      <div
        className={!seen ? style.unreadNotificationDiv : style.notificationDiv}
        onClick={readNotification}
      >
        {dpLoaded ? (
          <img className={style.notificationPicture} src={profilePhoto} alt=""></img>
        ) : (
          <FaUserCircle className={style.notificationPicture} />
        )}
        <div className={style.notificationDetail}>
          <p className={style.notificationName}>{fullname}</p>
          <p className={style.notificationContent}>Followed You</p>
          <p className={style.notificationStatus}>
            {daysLapsed > 0
              ? daysLapsed > 1
                ? daysLapsed + " days ago"
                : "Day ago"
              : hoursLapsed > 0
              ? hoursLapsed > 1
                ? hoursLapsed + " hours ago"
                : hoursLapsed + " hour ago"
              : minutesLapsed > 0
              ? minutesLapsed > 1
                ? minutesLapsed + "minutes ago"
                : minutesLapsed + " minute ago"
              : "just now"}
          </p>
        </div>
      </div>
    );
  } else return null;
}
export default NotificationItem;
