const express = require("express");
const router = express.Router();
const Story = require("./../model/story");
const User = require("./../model/user");
const Liked = require("./../model/liked");
const Notification = require("./../model/notification");
const Room = require("./../model/notificationRoom");

const auth = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.sendStatus(401);
  }
};

router.get("/post-liked", auth, async (req, res) => {
  try {
    const post_id = req.query.post_id;
    const user = await User.findOne({ _id: req.session.user });
    if (user) {
      const post_liked = await Liked.findOne({
        post_id: post_id,
        liked_by: user.username,
      });
      if (post_liked) {
        res.send(true);
      } else res.send(false);
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(444);
  }
});
router.post("/like-post", auth, async (req, res) => {
  try {
    const post_id = req.body.post_id;
    const user_id = req.session.user;
    const post_owner = req.body.post_owner;

    const liker = await User.findOne({ _id: user_id });
    if (liker) {
      const new_like = new Liked({
        post_id: post_id,
        liked_by: user_id,
      });
      if (new_like.save()) {
        res.send({
          sucess: false,
          message: "Story liked successfully",
        });
        const notification = await Notification.findOne({
          user_id: post_owner,
          post_id: post_id,
          type: "like",
        });
        if (!notification) {
          const createNotification = new Notification({
            user_id: post_owner,
            post_id: post_id,
            type: "like",
            last_activity:new_like._id,
            seen:false
          });
          createNotification.save()
        }else{
          notification.last_activity = new_like._id
          notification.save()
        }
      }
    } else {
      res.send({
        sucess: false,
        message: "Like not updated",
      });
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(444);
  }
});
router.post("/unlike-post", auth, async (req, res) => {
  try {
    const post_id = req.body.post_id;
    const user_id = req.session.user;

    const delete_like = await Liked.findOneAndDelete({
      post_id: post_id,
      liked_by: user_id,
    });
    if (delete_like) {
      res.send({
        sucess: true,
        message: "Unliked post",
      });
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(444);
  }
});
module.exports = router;
