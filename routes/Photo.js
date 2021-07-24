const router = require("express").Router();

const Story = require("./../model/story");
const User = require("./../model/user");
const ImageModel = require('../model/photo');
const photo = require("../model/photo");

const auth = (req, res, next) => {
    if (req.session.user) {
      next();
    } else {
      res.sendStatus(401);
    }
  };

router.get('/post-photos', auth, async(req, res)=>{
    try{
        const fetch_res = await ImageModel.find({
            post_id: req.query.id
        })
        res.send(fetch_res)
    }catch(err){
        res.sendStatus(500)
    }
})
router.get('/my-photos', async(req, res)=> {
    try{
        const user = await User.findOne({_id:req.session.user})
        if(user){
            const images = await ImageModel.find({owner:user.username}, null, {limit:6})
            res.send(images)
        }
    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }
})
router.get('/my-gallery', async(req, res)=> {
    try{
        const user = await User.findOne({_id:req.session.user})
        if(user){
            const images = await ImageModel.find({owner:user.username}, null, {limit:30})
            res.send(images)
        }
    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }
})
module.exports = router