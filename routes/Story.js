const Story = require("./../model/story");
const Photo = require("./../model/photo");
const User = require("./../model/user");
const Liked = require("./../model/liked");

const bcrypt = require("bcrypt");
const router = require("express").Router();
const fs = require("fs");
const following = require("../model/following");
const Comment = require('../model/comment')

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

router.post("/create", auth, async (req, res, next) => {
  try {
    const img_paths = req.body.imagePath;
    const content = req.body.content;
    const owner = req.body.owner;

    const data = new Story({
      owner: owner,
      content: content,
      photo_only: content !== "" && content !== undefined ? false : true,
      likes: 0,
      comments: 0,
    });

    if (img_paths !== null) {
      data.save(function (err, post) {
        if (err) return console.log(err);

        img_paths.forEach((path) => {
          const photo = new Photo({
            owner: post.owner,
            post_id: post._id,
            path: path,
          });
          photo.save(function (err, saved_photo) {
            if (err) return console.log(err);
          });
        });
        res.send(post);
      });
    } else {
      if (content !== undefined && content !== "") {
        data.save(function (err, post) {
          if (err) {
            console.log(err);
            res.sendStatus(444);
          }
          if (post) {
            res.send(post);
          } else {
            res.sendStatus(444);
          }
        });
      } else {
        console.log(content);
        res.sendStatus(403);
      }
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(444);
  }
});
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
router.post("/add-comment", auth, async(req, res)=> {
    try{
        const postId = req.body.post_id
        const content = req.body.content
        const user = await User.findOne({_id:req.session.user})
        if(user){
            const newComment = new Comment({
                post_id: postId,
                comment_by: user.username,
                content:content
            })
            const savedComment = await newComment.save()
            if(savedComment){
                Story.findOneAndUpdate(
                    {
                      _id: postId
                    },
                    {
                      $inc: {
                        comments: +1,
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
                      } else res.send(savedComment)
                    }
                  );

            }else{
                res.send(false)
            }
        }else res.sendStatus(401)
    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }
})
// --------- END OF POST ROUTE   ------------
router.get("/my-posts", auth, async (req, res, next) => {
    try {
      const user = await User.findOne({ _id: req.session.user });
      if (user) {
        const stories = await Story.find({ owner: user.username }, null, {
          limit: 10,
        }).sort({ date: -1 });
        res.send(stories);
      }
    } catch (err) {
      console.log(err);
      res.sendStatus(444);
    }
  });
  router.get("/view", auth, async (req, res, next) => {
    try {
      const post_id = req.query.post_id;
      if (post_id) {
        const story = await Story.findOne({ _id: post_id });
        res.send(story);
      }
    } catch (err) {
      console.log(err);
      res.sendStatus(444);
    }
  });
  router.get("/all-feeds", auth, async (req, res, next) => {
    try {
      const feeds = await Story.find().sort({ date: -1 });
      res.send(feeds);
    } catch (error) {
      console.log(error);
    }
  });
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
router.get('/post-comments', auth, async(req, res)=> {
    const page = parseInt(req.query.page)
    const size = parseInt(req.query.size)
    const limit = 10
    const start = size - limit
    const to_skip  = (page - 1) * limit
    const skip = start - to_skip < 0? 0 : start - to_skip
    try{
        const post_id = req.query.post_id
        const comments = await Comment.find({post_id:post_id},null,{limit:limit, skip:skip})
        if(comments){
            res.send(comments)
        }else{
            res.send([])
        }
    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }
})
// ------- DELETE ROUTE -----------
router.delete("/story", auth, async (req, res) => {
  Story.findOneAndDelete({ _id: req.body.post_id }, function (err, doc) {
    if (err) {
      console.log(err);
      res.sendStatus(444);
    }
    if (!doc) res.sendStatus(444);
  });
});

// DELETING ALL STORIES
router.delete("/all", admin, (req, res, next) => {
  Story.deleteMany({}, (story_err, story_res) => {
    if (story_err) {
      console.log(story_err);
      return res.sendStatus(444);
    }
    console.log("Story deleted from database");
    Photo.deleteMany({}, function (photo_err, photo_del) {
      if (photo_err) {
        console.log(photo_err);
        return res.sendStatus(444);
      }
      console.log("Photo deleted from database");
      res.send({ msg: "Story deleted" });
      const dir = "./uploads/user/";
      // fs.unlinkSync(dir, (del_err)=>{
      //     if(del_err){
      //         console.log(del_err)
      //         return res.sendStatus(444)
      //     }
      //     console.log('Photo deleted at :'+dir)
      //     res.send({msg:'Story deleted'})
      // })
    });
  });
});
module.exports = router;
