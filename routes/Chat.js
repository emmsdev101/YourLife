const express = require("express");
const chat = require("../model/chat");
const chatRoom = require("../model/chatRoom");
const user = require("../model/user");
const router = express.Router();
const SocketSchema = require("./../model/socketclients");

const auth = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.sendStatus(401);
  }
};

router.get("/inbox", auth, async (req, res) => {
  try {
    const page = parseInt(req.params.page || "0");
    const userId = req.session.user;
    const myRooms = await chatRoom
      .find({ "participants.user_id": userId })
      .skip(page * 10)
      .sort({ "last_sender.date": -1 })
      .limit(10);
    let roomsToSend = [];

    for (let i = 0; i < myRooms.length; i++) {
      const room = myRooms[i];
      const me = room.participants.find((mine) => mine.user_id === userId);
      if (!room?.isgroup) {
        const recptId =
          room.participants[0].user_id === userId
            ? room.participants[1].user_id
            : room.participants[0].user_id;
        const recptData = await user.findOne({ _id: recptId }, { password: 0 });
        roomsToSend.push({
          last_sender: room.last_sender,
          _id: room._id,
          updatedAt: room.updatedAt,
          isgroup: false,
          recipient: recptData,
          seen: me?.seen,
        });
      } else {
        roomsToSend.push({
          last_sender: room.last_sender,
          _id: room._id,
          updatedAt: room.updatedAt,
          isgroup: room.isgroup,
          seen: me?.seen,
          name:room.name,
          photo:room.photo
        });
      }
    }
    res.send(roomsToSend);
  } catch (err) {
    console.log(err);
    res.send(500);
  }
});
router.get("/isMember", auth, async (req, res) => {
  try {
    const userId = req.session.user;
    const recipient = req.query.recipient;
    const room = await chatRoom.findOne({
      "participants.user_id": userId,
      "participants.user_id": recipient,
    });
    res.send(room);
  } catch (err) {
    console.log(err);
    res.send(500);
  }
});
router.post("/create", auth, async (req, res) => {
  try {
    let io = req.app.get("socketio");
    const recipient = req.body.recipient;
    const sender = req.session.user;
    const message = req.body.message;

    if (recipient && sender && message) {
      const createChat = new chatRoom({
        participants: [{ user_id: sender, seen: true }, { user_id: recipient }],
        last_sender: {
          user_id: sender,
          message: message,
        },
      });
      const createdChat = await createChat.save();
      if (createdChat) {
        const createMessage = new chat({
          room_id: createdChat._id,
          sender: sender,
          content: message,
        });
        const savedMessage = await createMessage.save();
        res.send(savedMessage);

        const recptId =
          createdChat.participants[0].user_id === sender
            ? createdChat.participants[1].user_id
            : createdChat.participants[0].user_id;
        const recptData = await user.findOne({ _id: recptId }, { password: 0 });
        const me = createdChat.participants.find(
          (mine) => mine.user_id === sender
        );

        const chatToSend = {
          last_sender: createdChat.last_sender,
          _id: createdChat._id,
          updatedAt: createdChat.updatedAt,
          isgroup: false,
          recipient: recptData,
          seen: me?.seen,
        };
        const connected = await SocketSchema.findOne({ user_id: recptId });
        if (connected) {
          io.to(connected.socket_id).emit("chat", {
            sender: sender,
            chat: chatToSend,
          });
        }
      } else res.sendStatus(403);
    } else res.sendStatus(403);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});
router.post("/newGroup", auth, async (req, res) => {
  try {
    let io = req.app.get("socketio");
    const recipients = req.body.recipients;
    const sender = req.session.user;
    const name = req.body.name;

    if (recipients && sender) {
      const createGroup = new chatRoom({
        participants: [{ user_id: sender, seen: true }, ...recipients],
        last_sender: {
          user_id: sender,
          message: "New group created",
        },
        isgroup: true,
        name: name,
      });
      const createdGroup = await createGroup.save();
      if (createdGroup) {
        res.send({
          updatedAt: createdGroup.updatedAt,
          isgroup: createdGroup.isgroup,
          _id: createdGroup._id,
          name: createdGroup.name,
        });
        const recipients = createdGroup.participants;
        for (let i = 0; i < recipients.length; i++) {
          const reciever = recipients[i].user_id;
          if (reciever !== sender) {
            const connected = await SocketSchema.findOne({ user_id: reciever });
            if (connected) {
              io.to(connected.socket_id).emit("chat", {
                sender: sender,
                chat: createdGroup,
              });
            }
          }
        }
      } else res.sendStatus(403);
    } else res.sendStatus(403);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});
router.post("/reply", auth, async (req, res) => {
  try {
    let io = req.app.get("socketio");
    const sender = req.session.user;
    const message = req.body.message;
    const roomId = req.body.room_id;

    if (sender && message) {
      const room = await chatRoom.findOne({ _id: roomId });
      if (room) {
        const createMessage = new chat({
          room_id: room._id,
          sender: sender,
          content: message,
        });
        const savedMessage = await createMessage.save();
        res.send(savedMessage);
        const senderData = await user.findOne({_id:sender}, {password:0})
        

        if(savedMessage && senderData){
          io.in(roomId).emit('message', {
            sender: senderData,
            message: savedMessage,
            isSender: false,
            sender_id:sender
          })
        }
        for (let i = 0; i < room.participants.length; i++) {
          const participant = room.participants[i];
          if (participant.user_id !== sender) {
            room.participants[i].seen = false;
          }
        }
        room.last_sender.user_id = sender;
        room.last_sender.message = message;
        room.last_sender.date = Date.now();
        const newRoom = await room.save();

        let chatToSend = {};

        if (newRoom.isgroup) {
          chatToSend = newRoom;
        } else {
          const recptId =
            newRoom.participants[0].user_id === sender
              ? newRoom.participants[1].user_id
              : newRoom.participants[0].user_id;
          const recptData = await user.findOne(
            { _id: recptId },
            { password: 0 }
          );
          const me = newRoom.participants.find(
            (mine) => mine.user_id === sender
          );

          chatToSend = {
            last_sender: newRoom.last_sender,
            _id: newRoom._id,
            updatedAt: newRoom.updatedAt,
            isgroup: false,
            recipient: recptData,
            seen: me?.seen,
          };
        }

        const recipients = newRoom.participants;
        for (let i = 0; i < recipients.length; i++) {
          const reciever = recipients[i].user_id;
          if (reciever !== sender) {
            const connected = await SocketSchema.findOne({ user_id: reciever });
            if (connected) {
              io.to(connected.socket_id).emit("chat", {
                sender: sender,
                chat: chatToSend,
              });
            }
          }
        }
      } else res.sendStatus(403);
    } else res.sendStatus(403);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});
router.post("/read", auth, async (req, res)=>{
  try {
    const roomId =  req.body.room_id
    const userId = req.session.user

    const room = await chatRoom.findOne({_id:roomId})
    for (let i = 0; i < room.participants.length; i++) {
      const participant = room.participants[i];
      if(participant.user_id === userId){
        room.participants[i].seen = true
        break
      }
    }
    const updatedChatRoom = await room.save()
    if(updatedChatRoom){
      res.send(true)
    }else res.sendStatus(403)
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }

})
router.get("/messages", auth, async (req, res) => {
  try {
    const roomId = req.query.room;
    const page = parseInt(req.query.page || 0);
    const userId = req.session.user;
    const limit = 20;
    const skip = limit * page;
    if (roomId) {
      const messages = await chat
        .find({ room_id: roomId })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });
      let messagesResponse = [];
      for (let i = 0; i < messages.length; i++) {
        const message = messages[i];
        if (message.sender === userId) {
          messagesResponse.push({
            message: message,
            isSender: true,
          });
        } else {
          const senderProfile = await user.findOne(
            { _id: message.sender },
            { password: 0 }
          );
          messagesResponse.push({
            sender: senderProfile,
            message: message,
            isSender: false,
          });
        }
      }
      res.send(messagesResponse);
    } else res.sendStatus(403);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});
module.exports = router;
