const bcrypt = require("bcrypt");
const router = require("express").Router();
const fs = require("fs");

const Story = require("./../model/story");
const User = require("./../model/user");
const ImageModel = require("../model/photo");
const Liked = require("./../model/liked");
const Followers = require("./../model/following");
const Comments = require("./../model/comment");
const Comment = require("./Comment");
const Like = require("./Like");
const FeedsSchema = require("./../model/newsfeed");
router.use("/comment", Comment);
router.use("/like", Like);

const saveImage = require("../helper/Upload");
const { uploadFile } = require("../helper/s3");

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
    const files = req.body.files;
    const content = req.body.content;
    const user = await User.findOne({ _id: req.session.user });
    if (user) {
      const owner = user.username;
      const data = new Story({
        owner: owner,
        owner_id: user._id,
        content: content,
        photo_only: content !== "" && content !== undefined ? false : true,
        likes: 0,
        comments: 0,
      });

      if (Array.isArray(files)) {
        const post = await data.save();

        if (post) {
          const savedImages = [];
          for (let index = 0; index < files.length; index++) {
            const file = files[index];
            const savedImage = await saveImage(req, res, file);
            if (savedImage) {
              const uploadToBucket = await uploadFile(savedImage);
              const photo = new ImageModel({
                owner: post.owner,
                post_id: post._id,
                path: uploadToBucket.key,
              });
              const saved = await photo.save();
              if (!saved) {
                res.sendStatus(500);
              }
              savedImages.push(saved);
            }
          }
          const posted = {
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            photo: user.photo,
            content: data.content,
            likes: data.likes,
            comments: data.comments,
            photos: savedImages,
            liked: false,
            _id: data._id,
          };
          res.send(posted);
        } else {
          res.sendStatus(500);
        }
      } else {
        if (content !== undefined && content !== "") {
          const post = await data.save();
          if (post) {
            const posted = {
              username: user.username,
              firstname: user.firstname,
              lastname: user.lastname,
              photo: user.photo,
              content: post.content,
              likes: post.likes,
              comments: post.comments,
              photos: [],
              liked: false,
              _id: post._id,
            };
            res.send(posted);
          } else {
            res.sendStatus(500);
          }
        }
      }
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(444);
  }
});
// --------- END OF POST ROUTE   ------------
router.get("/my-posts", auth, async (req, res, next) => {
  try {
    let username = req.query.username;
    const userId = req.session.user;
    let user;
    if (!username) {
      user = await User.findOne({ _id: req.session.user });
    } else {
      user = await User.findOne({ username: username });
    }
    const stories = await Story.find({ owner: user.username }, null, {
      limit: 10,
    }).sort({ date: -1 });
    if (Array.isArray(stories)) {
      const feedsObjectList = [];
      for (let index = 0; index < stories.length; index++) {
        const feed = stories[index];
        const photos = await ImageModel.find({ post_id: feed._id });
        const liked = await Liked.findOne({
          post_id: feed._id,
          liked_by: userId,
        });
        const likes = await Liked.countDocuments({ post_id: feed._id });
        const comments = await Comments.countDocuments({ post_id: feed._id });
        feedsObjectList.push({
          username: user.username,
          firstname: user.firstname,
          lastname: user.lastname,
          photo: user.photo,
          content: feed.content,
          likes: likes,
          comments: comments,
          photos: photos,
          liked: liked ? true : false,
          _id: feed._id,
          date: feed.date,
          post_owner: user._id,
        });
      }
      res.send(feedsObjectList);
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(444);
  }
});
router.get("/view", auth, async (req, res, next) => {
  try {
    const post_id = req.query.id;
    const userId = req.session.user;

    const likes = await Liked.countDocuments({ post_id: post_id });
    const comments = await Comments.countDocuments({ post_id: post_id });
    const isLiked = await Liked.findOne({ post_id: post_id, liked_by: userId });
    if (post_id) {
      Story.findOne({ _id: post_id }, (err, story) => {
        if (err) return res.sendStatus(444);
        if (!story) return res.sendStatus(403);
        User.findOne({ username: story.owner }, (err, user) => {
          if (err) return res.sendStatus(444);
          if (!user) return res.sendStatus(403);
          ImageModel.find({ post_id: story._id }, (err, images) => {
            if (err) return res.sendStatus(444);
            if (!images) return res.sendStatus(403);

            const storyObject = {
              username: user.username,
              firstname: user.firstname,
              lastname: user.lastname,
              post_owner: user._id,
              photo: user.photo,
              content: story.content,
              images: images,
              likes: likes || 0,
              comments: comments || 0,
              date: story.date,
              liked: isLiked ? true : false,
              _id: story._id,
            };
            res.send(storyObject);
          });
        });
      });
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

// -----------  TESTS --------------
router.get("/view-all", admin, async (req, res, next) => {
  try {
    const story = await Story.findOne();
    res.send(story);
  } catch (err) {
    console.log(err);
    res.sendStatus(444);
  }
});
router.get("/generate-feeds", auth, async (req, res, next) => {
  try {
    const userId = req.session.user;
    const myProfile = await User.findOne({ _id: userId }, { username: 1 });
    if (myProfile) {
      const myFeeds = await FeedsSchema.find({ user_id: userId })
        .limit(20)
        .sort({ date_posted: -1 });
      if (myFeeds) {
        let feedsResult = [];
        for (let i = 0; i < myFeeds.length; i++) {
          const feedItem = myFeeds[i];
          const postOwner = await User.findOne({ _id: feedItem.owner_id });
          if (postOwner) {
            const likes = await Liked.countDocuments({
              post_id: feedItem.post_id,
            });
            const comments = await Comments.countDocuments({
              post_id: feedItem.post_id,
            });
            const photos = await ImageModel.find({ post_id: feedItem.post_id });
            const liked = await Liked.findOne({
              post_id: feedItem.post_id,
              liked_by: userId,
            });
            feedsResult.push({
              username: postOwner.username,
              firstname: postOwner.firstname,
              lastname: postOwner.lastname,
              photo: postOwner.photo,
              content: feedItem.content,
              likes: likes || 0,
              comments: comments || 0,
              photos: photos,
              liked: liked ? true : false,
              _id: feedItem.post_id,
              date: feedItem.date_posted,
              post_owner: postOwner._id,
            });
          }
          }
          if(feedsResult){
            res.send(feedsResult);
            const following = await Followers.find({ follower: myProfile.username });
            if (following) {
              await FeedsSchema.deleteMany({ user_id: userId });
              for (let i = 0; i < following.length; i++) {
                const profile = following[i];
                const stories = await Story.find({ owner: profile.following })
                  .sort({ date: -1 })
                  .limit(20);
                for (let j = 0; j < stories.length; j++) {
                  const post = stories[j];
                  const addFeed = new FeedsSchema({
                    post_id: post._id,
                    user_id: userId,
                    date_posted: post.date,
                    owner_id: post.owner_id,
                    photos: post.photos,
                    content: post.content,
                  });
                  addFeed.save();
                }
              }
            }
          }
        } 
  }
  } catch (err) {
    console.log(err);
  }
});
router.get("/get-feeds", auth, async (req, res, next) => {
  try {
    const userId = req.session.user;
    const page = req.query.page || 0;
    const limit = 20;
    const skip = 10 * page;
    console.log("skip", skip);
    const myProfile = await User.findOne({ _id: userId }, { username: 1 });
    if (myProfile) {
      const myFeeds = await FeedsSchema.find({ user_id: userId })
        .limit(limit)
        .skip(skip)
        .sort({ date_posted: -1 });
      if (myFeeds) {
        let feedsResult = [];
        for (let i = 0; i < myFeeds.length; i++) {
          const feedItem = myFeeds[i];
          const postOwner = await User.findOne({ _id: feedItem.owner_id });
          if (postOwner) {
            const likes = await Liked.countDocuments({
              post_id: feedItem.post_id,
            });
            const comments = await Comments.countDocuments({
              post_id: feedItem.post_id,
            });
            const photos = await ImageModel.find({ post_id: feedItem.post_id });
            const liked = await Liked.findOne({
              post_id: feedItem.post_id,
              liked_by: userId,
            });
            feedsResult.push({
              username: postOwner.username,
              firstname: postOwner.firstname,
              lastname: postOwner.lastname,
              photo: postOwner.photo,
              content: feedItem.content,
              likes: likes || 0,
              comments: comments || 0,
              photos: photos,
              liked: liked ? true : false,
              _id: feedItem.post_id,
              date: feedItem.date_posted,
              post_owner: postOwner._id,
            });
          }
        }
        res.send(feedsResult);
      } else res.sendStatus(403);
    } else res.sendStatus(403);
  } catch (err) {
    console.log(err);
  }
});
router.get("/all-feeds", auth, async (req, res, next) => {
  try {
    const feeds = await Story.find({}, {}, { limit: 10 }).sort({ date: -1 });
    if (Array.isArray(feeds)) {
      const feedsObjectList = [];
      for (let index = 0; index < feeds.length; index++) {
        const feed = feeds[index];
        const feedOwner = await User.findOne({ username: feed.owner });
        const photos = await ImageModel.find({ post_id: feed._id });
        const liked = await Liked.findOne({
          post_id: feed._id,
          liked_by: feedOwner.username,
        });
        feedsObjectList.push({
          post_owner: feedOwner._id,
          username: feedOwner.username,
          firstname: feedOwner.firstname,
          lastname: feedOwner.lastname,
          photo: feedOwner.photo,
          content: feed.content,
          likes: feed.likes,
          comments: feed.comments,
          photos: photos,
          liked: liked ? true : false,
          _id: feed._id,
        });
      }
      res.send(feedsObjectList);
    }
  } catch (error) {
    console.log(error);
  }
});

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
    ImageModel.deleteMany({}, function (photo_err, photo_del) {
      if (photo_err) {
        console.log(photo_err);
        return res.sendStatus(444);
      }
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
