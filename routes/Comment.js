const express = require("express");
const router = express.Router();
const Story = require("./../model/story");
const User = require("./../model/user");
const Comment = require("../model/comment");
const Notification = require("./../model/notification");
const Room = require("./../model/notificationRoom");
const SocketSchema = require('./../model/socketclients')

const auth = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.sendStatus(401);
  }
};

const admin = (req, res, next) => {
  if (req.query.key === "iamamazing1998") {
    next();
  } else res.sendStatus(401);
};
router.post("/add-comment", auth, async (req, res) => {
  let io = req.app.get("socketio");
  try {
    const postId = req.body.post_id;
    const content = req.body.content;
    const post_owner = req.body.post_owner;
    const userId = req.session.user;

    const user = await User.findOne({ _id: req.session.user });
    if (user) {
      const newComment = new Comment({
        post_id: postId,
        comment_by: user.username,
        commentor_id: user._id,
        content: content,
      });
      const savedComment = await newComment.save();
      if (savedComment) {
        Story.findOneAndUpdate(
          {
            _id: postId,
          },
          {
            $inc: {
              comments: +1,
            },
          },
          { useFindAndModify: false },
          (err, doc) => {
            if (err) {
              console.log(err);
              res.sendStatus(444);
            }
            if (!doc) {
              console.log(err);
              res.sendStatus(404);
            } else
              res.send({
                username: user.username,
                firstname: user.firstname,
                lastname: user.lastname,
                photo: user.photo,
                comment_content: savedComment.content,
              });
          }
        );
        const notificationSender = await Notification.findOne({
          user_id: userId,
          post_id: postId,
          type: "comment",
        });
        if (!notificationSender) {
          const createNotification = new Notification({
            user_id: userId,
            post_id: postId,
            type: "comment",
            date_commented:savedComment.createdAt,
            last_activity: savedComment._id,
          });
          createNotification.save();
        }
        const notification_reciever = await Notification.findOne({
          user_id: post_owner,
          post_id: postId,
          type: "comment",
        });
        if (!notification_reciever) {
          const createNotification = new Notification({
            user_id: post_owner,
            post_id: postId,
            date_commented:savedComment.createdAt,
            type: "comment",
          });
          createNotification.save();
        }
        const commentRoom = await Room.findOne({
          post_id: postId,
        });
        if (commentRoom) {
          const senderExists = commentRoom.recipients.find(
            (recipient) => recipient === userId
          );
          if (!senderExists) {
            commentRoom.recipients.push(userId);
            commentRoom.save();
          }
          const recipients = commentRoom.recipients
          for (let i = 0; i < recipients.length; i++) {
            const reciever = recipients[i];
            const connected = await SocketSchema.findOne({user_id:reciever})
            if(connected){
              io.to(connected.socket_id).emit("notification",{
                type: "comment",
                date:savedComment.createdAt,
                comments: {
                  last_commentor: [user],
                  last_comment: savedComment.content,
                  owner: post_owner === reciever,
                },
                post_id: postId,
                comment_id: savedComment._id,
                seen: false,
                sender:userId,
            })
            }
            const notification_reciever = await Notification.findOne({
              user_id: reciever,
              post_id: postId,
              type: "comment",
            });
            if(notification_reciever){
              notification_reciever.seen = false
              notification_reciever.save()
            }
            
          }
          
        } else {
          const newcommentRoom = new Room({
            post_id: postId,
            recipients: [userId,post_owner],
            owner: post_owner,
          });
          newcommentRoom.save();
          const connected = await SocketSchema.findOne({user_id:post_owner})
          if(connected){
            io.to(connected.socket_id).emit("notification",{
              type: "comment",
              date:savedComment.createdAt,
              comments: {
                last_commentor: [user],
                last_comment: savedComment.content,
                owner: true,
              },
              post_id: postId,
              comment_id: savedComment._id,
              seen: false,
              sender:userId,
          })
          }
          
        }
      } else {
        res.send(false);
      }
    } else res.sendStatus(401);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});
router.get("/fetch-comments", auth, async (req, res) => {
  const page = parseInt(req.query.page);
  const size = parseInt(req.query.size);

  const limit = 10;
  const start = size - limit;
  const to_skip = (page - 1) * limit;
  const skip = start - to_skip < 0 ? 0 : start - to_skip;
  const final_limit = skip === 0 ? start - (page - 1 - 1) * limit : limit;

  try {
    const post_id = req.query.post_id;
    const comments = await Comment.find({ post_id: post_id }, null, {
      limit: final_limit,
      skip: skip,
    });

    if (Array.isArray(comments)) {
      const makeCommentObject = async () => {
        let commentors = [];
        for (i = 0; i < comments.length; i++) {
          const comment = comments[i];
          const commentor = await User.findOne({
            username: comment.comment_by,
          });
          if (commentor) {
            const commentResult = {
              username: commentor.username,
              firstname: commentor.firstname,
              lastname: commentor.lastname,
              photo: commentor.photo,
              comment_content: comment.content,
              date:comment.createdAt
            };
            commentors.push(commentResult);
          }
        }
        return commentors;
      };
      const commentObject = await makeCommentObject();
      res.send(commentObject.reverse());
    } else {
      res.send([]);
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

module.exports = router;
