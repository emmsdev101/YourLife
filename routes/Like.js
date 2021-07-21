const express = require('express')
const router = express.Router()
const Story = require("./../model/story");
const User = require("./../model/user");
const Liked = require("./../model/liked");

const auth = (req, res, next) => {
    if (req.session.user) {
      next();
    } else {
      res.sendStatus(401);
    }
  };

router.get('/post-liked', auth, async(req, res)=>{
    try{
        const post_id = req.query.post_id
        const user = await User.findOne({_id:req.session.user})
        if(user){
            const post_liked = await Liked.findOne({
                post_id:post_id,
                liked_by:user.username
            })
            if(post_liked){
                res.send(true)
            }else res.send(false)
        }
    }catch(err){
        console.log(err)
        res.sendStatus(444)
    }
})
router.post("/like-post", auth, async (req, res) => {
    try {
      const post_id = req.body.post_id;
      const user = await User.findOne({ _id: req.session.user });
      const likes = await Liked.findOne({
        post_id: post_id,
        liked_by: user.username,
      });
      if (!likes) {
        const newLike = new Liked({
          post_id: post_id,
          liked_by: user.username,
        });
        const likeSaved = await newLike.save();
        if (likeSaved) {
          Story.findOneAndUpdate(
              {
                _id: post_id
              },
              {
                $inc: {
                  likes: +1,
                },
              },
              {useFindAndModify:false},
              (err, doc) => {
                if (err) {
                  console.log(err);
                  res.sendStatus(444);
                }
                if (!doc) {
                  console.log(err);
                  res.sendStatus(404);
                }else res.send(true)
              }
            );
        }else{
          res.send(null);
        }
      } else {
        Liked.deleteOne({ _id: likes._id }, null, (err) => {
          if (err) {
            console.log(err);
            res.sendStatus(444);
          }
          Story.findOneAndUpdate(
            {
              _id: post_id,
              likes: { $gt: 0 },
            },
            {
              $inc: {
                likes: -1
              },
            },
            {useFindAndModify:false},
            (err, doc) => {
              if (err) {
                console.log(err);
                res.sendStatus(444);
              }
              if (!doc) {
                console.log(err);
                res.sendStatus(404);
              }else res.send(true)
            }
          );
        });
      }
    } catch (err) {
      console.log(err);
      res.sendStatus(444);
    }
  });
  module.exports = router