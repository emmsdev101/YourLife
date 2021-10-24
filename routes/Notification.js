const express = require("express");
const router = express.Router();
const Story = require("./../model/story");
const User = require("./../model/user");
const Liked = require("./../model/liked");
const Notification = require("./../model/notification");
const Rooms = require("./../model/notificationRoom");
const Comment = require("./../model/comment");

const auth = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.sendStatus(401);
  }
};
router.get("/", auth, async (req, res) => {
  try {
    const userId = req.session.user;
    const page = req.query.page || 0;

    const limit = 20;
    const skip = limit * page;
    const myNotifications = await Notification.find({ user_id: userId })
      .sort({ updatedAt: -1 })
      .limit(limit)
      .skip(skip);
    let notificationRes = [];
    for (let index = 0; index < myNotifications.length; index++) {
      const notification = myNotifications[index];
      if (notification.type === "comment") {
        const lastComment = await Comment.find({
          post_id: notification.post_id,
          commentor_id: { $ne: userId },
          createdAt: { $gt: notification.date_commented },
        })
          .sort({ updatedAt: -1 })
          .limit(1);
        const commentRoom = await Rooms.findOne({
          post_id: notification.post_id,
        });
        const numCommentor = commentRoom.recipients.length;

        if (lastComment[0]) {
          let lastCommentors = [];
          for (let i = 0; i < lastComment.length; i++) {
            const comment = lastComment[i];
            const commenter = await User.findOne(
              { username: comment.comment_by },
              { password: 0 }
            );
            lastCommentors.push(commenter);
          }
          notificationRes.push({
            type: "comment",
            date: lastComment[0].createdAt,
            comments: {
              last_commentor: lastCommentors,
              last_comment: lastComment[0]?.content,
              count: numCommentor,
              owner: commentRoom.owner === userId,
            },
            post_id: notification.post_id,
            comment_id: lastComment[0]._id,
            seen: notification.seen,
            notification_id: notification._id,
          });
        }
      }
      if (notification.type === "like") {
        const lastlikers = await Liked.find({
          post_id: notification.post_id,
          liked_by: { $ne: userId },
        })
          .sort({ updatedAt: -1 })
          .limit(3);

        const numLikers = await Liked.countDocuments({
          post_id: notification.post_id,
        });
        const story_details = await Story.findOne({
          _id: notification.post_id,
        });

        let lastlikersData = [];
        for (let index = 0; index < lastlikers.length; index++) {
          const liker = lastlikers[index];
          const likerData = await User.findOne(
            { _id: liker.liked_by },
            { password: 0 }
          );
          lastlikersData.push(likerData);
        }
        notificationRes.push({
          _id: notification._id,
          type: "like",
          likers: lastlikersData,
          story: story_details,
          last_activity: notification.last_activity,
          seen: notification.seen,
          num_likers: numLikers,
          notification_id: notification._id,
          date: notification.createdAt,
        });
      }
      if (notification.type === "follow") {
        const follower = await User.findOne(
          { username: notification.last_activity },
          { password: 0 }
        );
        notificationRes.push({
          _id: notification._id,
          type: "follow",
          follower: follower,
          seen: notification.seen,
          notification_id: notification._id,
          date: notification.createdAt,
        });
      }
    }
    res.send(notificationRes);
  } catch (err) {
    res.sendStatus(500);
    console.log(err);
  }
});
router.post("/read-comment", auth, async (req, res) => {
  const commentId = req.body.comment_id;
  const notificationId = req.body.notification_id;

  const updateNotification = await Notification.findByIdAndUpdate(
    notificationId,
    {
      last_activity: commentId,
      seen:true
    }
  );
  if (updateNotification) {
    res.send({
      success: true,
      message: "Notification updated",
    });
  } else
    res.send({
      success: false,
      message: "Notification not updated",
    });
});
router.post("/read", auth, async (req, res) => {
  const notificationId = req.body.notification_id;
  const updateNotification = await Notification.findByIdAndUpdate(
    notificationId,
    {
      seen: true,
    }
  );
  if (updateNotification) {
    res.send({
      success: true,
      message: "Notification updated",
    });
  } else {
    res.send({
      success: true,
      message: "Notification updated",
    });
  }
});

module.exports = router;
